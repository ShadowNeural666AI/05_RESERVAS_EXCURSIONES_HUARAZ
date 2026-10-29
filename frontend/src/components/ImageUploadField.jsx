import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function ImageUploadField({
  currentImageUrl = '',
  selectedFile = null,
  onFileSelect,
  onClearFile,
  disabled = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Generar URL temporal para la vista previa del archivo recién seleccionado
  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : currentImageUrl;

  const validateAndPassFile = (file) => {
    setError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Formato no permitido (${file.type || 'desconocido'}). Solo se aceptan JPEG, PNG y WebP.`);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`El archivo pesa ${sizeMB} MB, excediendo el límite máximo de ${MAX_SIZE_MB} MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="image-upload-component" style={{ marginTop: '8px' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        disabled={disabled}
        style={{ display: 'none' }}
        id="image-file-input"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        style={{
          border: dragActive ? '2px dashed var(--primary-color, #0284c7)' : '2px dashed #cbd5e1',
          backgroundColor: dragActive ? 'rgba(2, 132, 199, 0.05)' : '#f8fafc',
          borderRadius: '12px',
          padding: '20px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          position: 'relative'
        }}
      >
        {previewUrl ? (
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <img
              src={previewUrl}
              alt="Vista previa"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/laguna69.jpg';
              }}
            />
            {selectedFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  onClearFile();
                }}
                title="Quitar archivo seleccionado"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Upload size={28} />
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          {selectedFile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#16a34a' }}>
                Archivo listo para optimizar y subir
              </span>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
              Arrastra una imagen aquí o <span style={{ color: '#0284c7', textDecoration: 'underline' }}>examina tu equipo</span>
            </p>
          )}

          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            {selectedFile ? (
              <span><strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})</span>
            ) : (
              'Formatos aceptados: JPEG, PNG, WebP (Máx. 5 MB). Conversión automática a WebP + Miniatura.'
            )}
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            fontSize: '0.82rem'
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
