"use client";

import { Github, Home, Smile, Music, BowArrow } from "lucide-react";
import { dictionary, Language } from "../data/i18n";

interface FloatingLinksProps {
    lang: Language;
}

export default function FloatingLinks({ lang }: FloatingLinksProps) {
    const t = dictionary[lang];

    // Determine external URL for emojis
    const emojisUrl = lang === "en"
        ? "https://emojis.gonzalogramagia.com/en"
        : "https://emojis.gonzalogramagia.com";

    return (
        <>
            {/* Right Side Buttons: Github */}
            <div className="fixed bottom-8 right-8 flex gap-3 z-50">
                <a
                    href="https://github.com/gonzalogramagia/home"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
                    aria-label={t.ariaGithub}
                >
                    <Github className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors" />
                </a>
            </div>

            {/* Left Side Buttons: Home + Emojis + Music + Tasks */}
            <div className="fixed bottom-8 left-8 flex gap-3 z-50">
                <button
                    disabled
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg transition-all opacity-50 cursor-not-allowed group"
                    aria-label={t.goToHome}
                    title={t.goToHome}
                >
                    <Home className="w-6 h-6 text-zinc-900 dark:text-white transition-colors" />
                </button>
                <a
                    href={emojisUrl}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
                    aria-label={t.goToEmojis}
                    title={t.goToEmojis}
                >
                    <Smile className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
                <a
                    href="https://music.gonzalogramagia.com"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label={t.goToMusic}
                    title={t.goToMusic}
                >
                    <Music className="w-6 h-6 text-zinc-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
                <a
                    href="https://tasks.gonzalogramagia.com"
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group cursor-pointer"
                    aria-label={t.goToTasks}
                    title={t.goToTasks}
                >
                    <BowArrow className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors" />
                </a>
            </div>
        </>
    );
}
