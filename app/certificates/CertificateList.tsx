"use client";

import { Certificate } from "@/types/certificate";
import { useState } from "react";

export function CertificateList({ initialCertificates }: { initialCertificates: Certificate[] }) {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    if (initialCertificates.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="text-4xl mb-4">🎓</div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Nenhum certificado disponível</h3>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Você ainda não possui certificados emitidos. Participe de eventos para conquistá-los!
        </p>
        </div>
    );
    }

    const handleDownload = async (eventId: string) => {
        try {
            setDownloadingId(eventId);

            //chama a rota ponte
            const response = await fetch(`/api/certificates/${eventId}/download`);

            if (!response.ok) throw new Error("Erro ao baixar");

            //cria um link temporario para forçar o download do arquivo binario
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Certificado_${eventId.substring(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error("Falha no download:", error);
            alert("Não foi possível realizar o download do certificado no momento.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {initialCertificates.map((cert) => (
                    <div
                        key={cert.certificateId}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                <div>
                    <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                    Autêntico
                    </span>
                    </div>

                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-2">
                    {cert.eventTitle}
                    </h3>

                    <div className="space-y-2 mb-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <span className="font-medium">Carga Horária:</span> {cert.workloadHours} horas
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <span className="font-medium">Emitido em:</span> {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-mono mt-2 bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                    Cod: {cert.validationCode}
    </p>
    </div>
    </div>

    <button
    onClick={() => handleDownload(cert.eventId)}
    disabled={downloadingId === cert.eventId}
    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-70"
    >
    {downloadingId === cert.eventId ? (
        <span className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    Baixando...
    </span>
) : (
        <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    Baixar PDF
    </>
)}
    </button>
    </div>
))}
    </div>
);
}