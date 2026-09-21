import { __ } from '@wordpress/i18n';
import { useMemo, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import { TEXT_DOMAIN } from '../../../constants';
import type { FieldProps } from './FieldProps';

type FileFieldProps = FieldProps & {
    accept?: string;
    uploadUrl?: string;
    removeUrl?: string;
    downloadUrl?: string;
};

export function FileField({ label, name, required, description, control, accept, uploadUrl, removeUrl, downloadUrl }: FileFieldProps) {
    const { field: input } = useController({
        name,
        control,
        rules: { required },
    });
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileLabel = useMemo(() => {
        if (!input.value) {
            return '';
        }

        if (typeof input.value === 'string') {
            return input.value.split('/').pop() ?? input.value;
        }

        if (input.value instanceof File) {
            return input.value.name;
        }

        return String(input.value);
    }, [input.value]);

    const openPicker = () => {
        console.log('opening file picker');
        inputRef.current?.click();
    };

    const onChooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;

        if (!selectedFile) {
            return;
        }

        setError(null);

        if (!uploadUrl) {
            input.onChange(selectedFile);
            return;
        }

        try {
            setUploading(true);
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: selectedFile.name,
                    mime_type: selectedFile.type,
                }),
            });

            if (!response.ok) {
                throw new Error('Upload initialization failed');
            }

            const data = await response.json();
            const uploadResponse = await fetch(data.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type,
                },
                body: selectedFile,
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            input.onChange(data.path);
        } catch {
            setError(__('Le televersement a echoue.', TEXT_DOMAIN));
            input.onChange(null);
        } finally {
            setUploading(false);
        }
    };

    const onRemoveFile = async () => {
        setError(null);

        if (!input.value) {
            return;
        }

        try {
            if (removeUrl && typeof input.value === 'string') {
                setRemoving(true);
                const response = await fetch(removeUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ file: input.value }),
                });

                if (!response.ok) {
                    throw new Error('Remove failed');
                }

                const data = await response.json();

                await fetch(data.url, {
                    method: 'DELETE',
                });
            }
            input.onChange(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        } catch {
            setError(__('La suppression du fichier a echoue.', TEXT_DOMAIN));
        } finally {
            setRemoving(false);
        }
    };

    const onPreviewFile = async () => {
        if (!downloadUrl || typeof input.value !== 'string' || !input.value) {
            return;
        }

        setError(null);

        try {
            setPreviewing(true);
            const response = await fetch(downloadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file: input.value }),
            });

            if (!response.ok) {
                throw new Error('Preview initialization failed');
            }

            const data = await response.json();
            const presignedUrl = data.url;

            window.open(presignedUrl, '_blank', 'noopener,noreferrer');
        } catch {
            setError(__('La previsualisation du fichier a echoue.', TEXT_DOMAIN));
        } finally {
            setPreviewing(false);
        }
    };

    return (
        <div className="field-wrapper">
            <label className="field-label" htmlFor={name}>{label}
                {required && <span className="required">*</span>}
            </label>

            <div className="custom-upload">
                <input
                    id={name}
                    type="file"
                    accept={accept}
                    required={required}
                    ref={(node) => {
                        input.ref(node);
                        inputRef.current = node;
                    }}
                    onBlur={input.onBlur}
                    onChange={onChooseFile}
                    className="custom-upload-input"
                />

                <div className="custom-upload-actions">
                    <button type="button" className="custom-upload-button" onClick={openPicker} disabled={uploading || removing || previewing}>
                        {uploading ? __('Televersement...', TEXT_DOMAIN) : __('Choisir un fichier', TEXT_DOMAIN)}
                    </button>
                    {fileLabel && (
                        <button type="button" className="custom-upload-link" onClick={onRemoveFile} disabled={uploading || removing || previewing}>
                            {removing ? __('Suppression...', TEXT_DOMAIN) : __('Supprimer', TEXT_DOMAIN)}
                        </button>
                    )}
                    {fileLabel && downloadUrl && typeof input.value === 'string' && (
                        <button type="button" className="custom-upload-link" onClick={onPreviewFile} disabled={uploading || removing || previewing}>
                            {previewing ? __('Ouverture...', TEXT_DOMAIN) : __('Voir', TEXT_DOMAIN)}
                        </button>
                    )}
                </div>

                <p className="custom-upload-filename">
                    {fileLabel || __('Aucun fichier selectionne', TEXT_DOMAIN)}
                </p>
            </div>

            {error && <span className="field-error">{error}</span>}
            {description && <p className="field-hint">{description}</p>}
        </div>
    );
}