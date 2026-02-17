import React, { useEffect, useState, useRef } from 'react';
import { storageService } from '../services/storageService';
import type { FileItem } from '../services/storageService';
import { Upload, File as FileIcon, Trash2, Image as ImageIcon, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Files = () => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const data = await storageService.getFiles();
            setFiles(data);
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        try {
            await storageService.uploadFile(e.target.files[0]);
            await loadFiles();
        } catch (error: any) {
            console.error('Error uploading file:', error);
            alert(`Error al subir archivo: ${error.message || 'Error desconocido'}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (name: string) => {
        if (confirm(t('files.delete_confirm'))) {
            try {
                await storageService.deleteFile(name);
                setFiles(files.filter(f => f.name !== name));
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
    };

    const isImage = (name: string) => {
        return name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('files.title')}</h1>
                <div className="relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                    // accept="*" // Allow all
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {uploading ? <Loader className="animate-spin h-5 w-5" /> : <Upload className="h-5 w-5" />}
                        <span className="hidden md:inline">{uploading ? t('files.uploading') : t('files.upload')}</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500 dark:text-slate-400">Cargando...</div>
            ) : files.length === 0 ? (
                <div className="p-16 text-center text-gray-400 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('files.no_files')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <div key={file.id} className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center relative">
                                {isImage(file.name) ? (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FileIcon className="h-12 w-12 text-gray-300 dark:text-slate-600" />
                                )}

                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a href={file.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600">
                                        <ImageIcon className="h-4 w-4" />
                                    </a>
                                    <button onClick={() => handleDelete(file.name)} className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-slate-200 truncate" title={file.name}>
                                    {file.name.split('_').slice(1).join('_') || file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                    {new Date(file.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Files;
