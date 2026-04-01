import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Award, Download, ExternalLink, ShieldCheck, Upload, Trash2, FileText, ImageIcon } from "lucide-react";
import {
  addUserCertificate,
  formatCertDate,
  readUserCertificates,
  removeUserCertificate,
  USER_CERTIFICATES_UPDATED,
  type StoredUserCertificate,
} from "../lib/userCertificatesStorage";
import { downloadDataUrlFile } from "../lib/openDataUrlFile";

const MAX_FILE_MB = 2.3;

const builtinCertificates = [
  {
    id: "1",
    title: "Корпоративная информационная безопасность",
    issuer: "Алроса ИТ · ЕСО",
    issued: "15.12.2025",
    expires: "15.12.2028",
    credentialId: "ALROSA-SEC-2025-88421",
  },
  {
    id: "2",
    title: "Основы облачной архитектуры",
    issuer: "Яндекс Практикум",
    issued: "03.09.2025",
    expires: "—",
    credentialId: "YP-CLOUD-441902",
  },
  {
    id: "3",
    title: "Английский для IT: B2",
    issuer: "Skyeng Business",
    issued: "22.06.2025",
    expires: "—",
    credentialId: "SKG-EN-B2-7721",
  },
];

function fileBaseName(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

export function CertificatesPage() {
  const [userCerts, setUserCerts] = useState<StoredUserCertificate[]>(() => readUserCertificates());
  const [pendingDataUrl, setPendingDataUrl] = useState<string | null>(null);
  const [pendingMeta, setPendingMeta] = useState<{ fileName: string; mime: string; size: number } | null>(null);
  const [titleIn, setTitleIn] = useState("");
  const [issuerIn, setIssuerIn] = useState("");
  const [issuedIn, setIssuedIn] = useState(() => new Date().toISOString().slice(0, 10));
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sync = useCallback(() => setUserCerts(readUserCertificates()), []);

  useEffect(() => {
    sync();
    window.addEventListener(USER_CERTIFICATES_UPDATED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(USER_CERTIFICATES_UPDATED, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const resetPending = () => {
    setPendingDataUrl(null);
    setPendingMeta(null);
    setTitleIn("");
    setIssuerIn("");
    setIssuedIn(new Date().toISOString().slice(0, 10));
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onPickFile = (file: File | null) => {
    setUploadError(null);
    if (!file) return;
    const okMime =
      file.type === "application/pdf" ||
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/webp";
    if (!okMime) {
      setUploadError("Допустимы PDF, PNG, JPG или WebP.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadError(`Размер файла не больше ${MAX_FILE_MB} МБ.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPendingDataUrl(dataUrl);
      setPendingMeta({ fileName: file.name, mime: file.type, size: file.size });
      setTitleIn(fileBaseName(file.name).replace(/[-_]/g, " "));
      setIssuerIn("Мой архив");
    };
    reader.onerror = () => setUploadError("Не удалось прочитать файл.");
    reader.readAsDataURL(file);
  };

  const commitUpload = () => {
    if (!pendingDataUrl || !pendingMeta) return;
    const title = titleIn.trim() || fileBaseName(pendingMeta.fileName);
    const issuer = issuerIn.trim() || "Мой архив";
    const issuedIso = issuedIn ? new Date(issuedIn + "T12:00:00").toISOString() : new Date().toISOString();
    const out = addUserCertificate({
      title,
      issuer,
      issuedAt: issuedIso,
      fileName: pendingMeta.fileName,
      mimeType: pendingMeta.mime,
      dataUrl: pendingDataUrl,
    });
    if (!out.ok) {
      setUploadError(out.error);
      return;
    }
    resetPending();
  };

  const allCount = userCerts.length + builtinCertificates.length;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              width: "4px",
              height: "24px",
              borderRadius: "4px",
              background: "linear-gradient(180deg,#81d0f5,#81d0f5)",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div>
            <h1
              style={{
                fontSize: "21px",
                fontWeight: "800",
                color: "#000000",
                letterSpacing: "-0.4px",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Сертификаты
            </h1>
            <p style={{ fontSize: "13px", color: "#000000", margin: "8px 0 0", lineHeight: 1.55, maxWidth: "720px" }}>
              Подтверждения пройденного обучения и квалификаций. Ниже можно загрузить свои PDF или изображения — файлы
              хранятся локально в браузере (демо без сервера).
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          marginBottom: "20px",
          padding: "18px 20px",
          borderRadius: "16px",
          border: "1px dashed rgba(129,208,245,0.35)",
          background: "rgba(129,208,245,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <Upload size={18} style={{ color: "#000000" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#000000" }}>Загрузить свой сертификат</span>
        </div>
        <p style={{ fontSize: "12px", color: "#000000", margin: "0 0 14px", lineHeight: 1.5 }}>
          PDF, PNG, JPG или WebP, до {MAX_FILE_MB} МБ на файл.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
          style={{ display: "none" }}
          onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
        />

        {!pendingDataUrl ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "12px",
              border: "1px solid rgba(129,208,245,0.45)",
              background: "linear-gradient(135deg, rgba(129,208,245,0.25), rgba(129,208,245,0.12))",
              color: "#000000",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Upload size={16} />
            Выбрать файл
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-start" }}>
              {pendingMeta?.mime.startsWith("image/") ? (
                <img
                  src={pendingDataUrl}
                  alt=""
                  style={{ maxHeight: "100px", borderRadius: "10px", border: "1px solid rgba(129,208,245,0.1)" }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(129,208,245,0.08)",
                    color: "#000000",
                    fontSize: "12px",
                  }}
                >
                  <FileText size={20} style={{ color: "#000000" }} />
                  {pendingMeta?.fileName}
                </div>
              )}
              <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "11px", color: "#000000" }}>
                  Название
                  <input
                    value={titleIn}
                    onChange={(e) => setTitleIn(e.target.value)}
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(129,208,245,0.12)",
                      background: "rgba(0,0,0,0.25)",
                      color: "#000000",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </label>
                <label style={{ fontSize: "11px", color: "#000000" }}>
                  Кто выдал (организация)
                  <input
                    value={issuerIn}
                    onChange={(e) => setIssuerIn(e.target.value)}
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(129,208,245,0.12)",
                      background: "rgba(0,0,0,0.25)",
                      color: "#000000",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </label>
                <label style={{ fontSize: "11px", color: "#000000" }}>
                  Дата выдачи
                  <input
                    type="date"
                    value={issuedIn}
                    onChange={(e) => setIssuedIn(e.target.value)}
                    style={{
                      marginTop: "4px",
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(129,208,245,0.12)",
                      background: "rgba(0,0,0,0.25)",
                      color: "#000000",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </label>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                type="button"
                onClick={commitUpload}
                style={{
                  padding: "9px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #81d0f5, #81d0f5)",
                  color: "#000000",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Добавить в список
              </button>
              <button
                type="button"
                onClick={resetPending}
                style={{
                  padding: "9px 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,0.15)",
                  background: "transparent",
                  color: "#000000",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {uploadError ? (
          <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#FFB090" }}>{uploadError}</p>
        ) : null}
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: "16px",
        }}
      >
        {userCerts.map((c, i) => (
          <UserCertificateCard key={c.id} cert={c} index={i} onRemove={() => removeUserCertificate(c.id)} />
        ))}
        {builtinCertificates.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + (userCerts.length + i) * 0.05 }}
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "rgba(129,208,245,.04)",
              border: "1px solid rgba(129,208,245,.08)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(129,208,245,.25), rgba(129,208,245,.15))",
                  border: "1px solid rgba(129,208,245,.24)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Award size={24} style={{ color: "#000000" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#000000", margin: 0, lineHeight: 1.35 }}>{c.title}</h2>
                <p style={{ fontSize: "12px", color: "#000000", margin: "6px 0 0" }}>{c.issuer}</p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "11px",
                color: "#000000",
              }}
            >
              <div>
                <div style={{ marginBottom: "4px" }}>Выдан</div>
                <div style={{ color: "#000000", fontWeight: "600" }}>{c.issued}</div>
              </div>
              <div>
                <div style={{ marginBottom: "4px" }}>Действителен до</div>
                <div style={{ color: "#000000", fontWeight: "600" }}>{c.expires}</div>
              </div>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(0,0,0,.25)",
                border: "1px solid rgba(129,208,245,.06)",
                fontSize: "11px",
                color: "#000000",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShieldCheck size={14} style={{ color: "#000000", flexShrink: 0 }} />
              <span style={{ wordBreak: "break-all" }}>ID: {c.credentialId}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto" }}>
              <button
                type="button"
                disabled
                title="В демо для записей каталога файл не прикреплён"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,.1)",
                  background: "rgba(129,208,245,.04)",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                <Download size={14} />
                PDF
              </button>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(129,208,245,.12)",
                  background: "transparent",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <ExternalLink size={14} />
                Проверить
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {allCount === 0 ? null : (
        <p style={{ marginTop: "16px", fontSize: "11px", color: "#000000" }}>
          Всего в списке: {allCount}. Загруженные файлы доступны только в этом браузере.
        </p>
      )}
    </>
  );
}

function UserCertificateCard({
  cert,
  index,
  onRemove,
}: {
  cert: StoredUserCertificate;
  index: number;
  onRemove: () => void;
}) {
  const isImage = cert.mimeType.startsWith("image/");
  const issued = formatCertDate(cert.issuedAt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05 }}
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: "rgba(129,208,245,0.06)",
        border: "1px solid rgba(129,208,245,0.22)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(129,208,245,0.12)",
            border: "1px solid rgba(129,208,245,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {isImage ? (
            <img src={cert.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <FileText size={22} style={{ color: "#000000" }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#000000", margin: 0, lineHeight: 1.35 }}>{cert.title}</h2>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "800",
                padding: "3px 8px",
                borderRadius: "20px",
                background: "rgba(129,208,245,0.15)",
                border: "1px solid rgba(129,208,245,0.35)",
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Загружено вами
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#000000", margin: 0 }}>{cert.issuer}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          fontSize: "11px",
          color: "#000000",
        }}
      >
        <div>
          <div style={{ marginBottom: "4px" }}>Выдан</div>
          <div style={{ color: "#000000", fontWeight: "600" }}>{issued}</div>
        </div>
        <div>
          <div style={{ marginBottom: "4px" }}>Файл</div>
          <div style={{ color: "#000000", fontWeight: "600", wordBreak: "break-all" }}>{cert.fileName}</div>
        </div>
      </div>

      <div
        style={{
          padding: "10px 12px",
          borderRadius: "10px",
          background: "rgba(0,0,0,.25)",
          border: "1px solid rgba(129,208,245,.06)",
          fontSize: "11px",
          color: "#000000",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isImage ? <ImageIcon size={14} style={{ color: "#000000", flexShrink: 0 }} /> : <FileText size={14} style={{ color: "#000000", flexShrink: 0 }} />}
        <span>ID: {cert.id}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "auto" }}>
        <button
          type="button"
          onClick={() => downloadDataUrlFile(cert.dataUrl, cert.fileName, cert.mimeType)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(129,208,245,.35)",
            background: "rgba(129,208,245,.1)",
            color: "#000000",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Download size={14} />
          Скачать
        </button>
        <button
          type="button"
          onClick={onRemove}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,80,80,0.35)",
            background: "rgba(255,80,80,0.08)",
            color: "#FF8A8A",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Trash2 size={14} />
          Удалить
        </button>
      </div>
    </motion.article>
  );
}
