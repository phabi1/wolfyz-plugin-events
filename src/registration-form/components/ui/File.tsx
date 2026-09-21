import { useMemo } from "react";

export function File({ value }: { value: string }) {
    const basename = useMemo(() => {
        return value.split('/').pop() || value;
    }, [value]);

    const extension = useMemo(() => {
        const parts = basename.split('.');
        return parts.length > 1 ? parts.pop() : '';
    }, [basename]);

    const filetype = useMemo(() => {
        if (!extension) {
            return 'other';
        }
        switch (extension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'webp':
                return 'image';
            case 'pdf':
                return 'document';
            default:
                return 'other';
        }
    }, [extension]);
    if (filetype === 'image') {
        return <img src={value} alt={basename} style={{ maxWidth: '100px', maxHeight: '100px' }} />;
    }

    if (filetype === 'document') {
        return <span>{basename} (Document)</span>;
    }

    return (
        <span>{basename}</span>
    );
}