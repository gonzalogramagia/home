"use client";

import { useState, useEffect } from "react";
import { Copy, Pencil, Trash2, Save, Check, Github } from "lucide-react";

interface TextBlock {
  id: string;
  tag: string;
  title: string;
  content: string;
}

export default function LocalPage() {
  const [blocks, setBlocks] = useState<TextBlock[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);
  // ahora usamos IDs cortos tipo hash de 4 caracteres

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const savedBlocks = localStorage.getItem("localhost-blocks");

    if (savedBlocks) {
      try {
        const parsed = JSON.parse(savedBlocks);
        // migrate titles that were auto-generated as "Bloque <id>" to empty so placeholder shows
        // and ensure each block has a tag (random) for the placeholder
        const migrated = (parsed as any[]).map((b) => {
          const tag =
            b && typeof b.tag === "string" && b.tag ? b.tag : generateId();
          if (
            b &&
            typeof b.title === "string" &&
            /^Bloque [a-z0-9]{4}$/i.test(b.title)
          ) {
            return { ...b, title: "", tag };
          }
          return { ...b, tag };
        });
        setBlocks(migrated as TextBlock[]);
      } catch (e) {
        // fallback: parse and ensure tags
        const raw = JSON.parse(savedBlocks) as any[];
        const ensured = raw.map((b) => ({
          ...b,
          tag: b && b.tag ? b.tag : generateId(),
        }));
        setBlocks(ensured as TextBlock[]);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los bloques
  useEffect(() => {
    localStorage.setItem("localhost-blocks", JSON.stringify(blocks));
  }, [blocks]);

  // Si se hace click fuera del bloque en edición, guardar y salir de edición
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!editingBlockId) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Si el click fue sobre un enlace, no interferimos (abrirá en nueva pestaña)
      if (target.closest && target.closest("a")) return;

      // Encontrar el bloque que contiene el target (si existe)
      let node: HTMLElement | null = target;
      let targetBlockId: string | null = null;
      while (node) {
        const attr = node.getAttribute && node.getAttribute("data-block-id");
        if (attr) {
          targetBlockId = attr;
          break;
        }
        node = node.parentElement;
      }

      // Si el click fue dentro del mismo bloque en edición => no hacer nada
      if (targetBlockId === editingBlockId) return;

      // Guardar el bloque actualmente en edición
      const current = blocks.find((b) => b.id === editingBlockId);
      if (current) {
        updateBlock(current.id, editingContent);
      }

      if (targetBlockId) {
        // Si el click fue dentro de otro bloque: cambiar a ese bloque y cargar su contenido
        const next = blocks.find((b) => b.id === targetBlockId);
        if (next) {
          setEditingBlockId(next.id);
          setEditingContent(next.content);
          return;
        }
      }

      // Si fue fuera de cualquier bloque: cerrar edición
      setEditingBlockId(null);
      setEditingContent("");
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [editingBlockId, editingContent, blocks]);

  // Genera un hash corto de 4 caracteres (alfa-numérico) y evita colisiones
  const generateId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const make = () =>
      Array.from(
        { length: 4 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    let id = make();
    // en el improbable caso de colisión, volver a generar hasta que sea único
    const existing = new Set(blocks.map((b) => b.id));
    while (existing.has(id)) {
      id = make();
    }
    return id;
  };

  // Alterna entre modo edición para un bloque (editar/guardar)
  const toggleEditBlock = (block: TextBlock) => {
    if (editingBlockId === block.id) {
      // guardar
      updateBlock(block.id, editingContent);
      setEditingBlockId(null);
      setEditingContent("");
    } else {
      // guardar actual antes de cambiar
      saveCurrentEditing();
      // entrar a editar
      setEditingBlockId(block.id);
      setEditingContent(block.content);
    }
  };

  const saveCurrentEditing = () => {
    if (!editingBlockId) return;
    const current = blocks.find((b) => b.id === editingBlockId);
    if (current) updateBlock(current.id, editingContent);
  };

  // Convierte URLs en enlaces y aplica formato markdown (negrita e itálica)
  const formatText = (text: string) => {
    if (!text) return "";
    // escapar HTML básico
    const escapeHtml = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let formatted = escapeHtml(text);

    // 1. Linkify: Convierte URLs en enlaces
    const urlRegex = /((https?:\/\/|www\.)[\w\-.:/?#@!$&'()*+,;=%~]+)/g;
    formatted = formatted.replace(urlRegex, (match) => {
      const url = match.startsWith("http") ? match : `https://${match}`;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${match}</a>`;
    });

    // 2. Bold: **texto** -> <strong>texto</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // 3. Italics: _texto_ -> <em>texto</em>
    // Usamos un regex que intente no capturar guiones bajos dentro de enlaces o palabras
    formatted = formatted.replace(/_([^_]+)_/g, "<em>$1</em>");

    return formatted;
  };

  const addBlock = () => {
    const id = generateId();
    const newBlock: TextBlock = {
      id,
      tag: generateId(),
      title: "",
      content: "",
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  const updateBlockTitle = (id: string, title: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, title } : block))
    );
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBlockId(id);
      setTimeout(() => setCopiedBlockId(null), 2000);
    });
  };

  const deleteBlock = (id: string) => {
    if (deletingBlockId === id) {
      setBlocks((prev) => prev.filter((block) => block.id !== id));
      setDeletingBlockId(null);
    } else {
      setDeletingBlockId(id);
      setTimeout(() => {
        setDeletingBlockId((current) => (current === id ? null : current));
      }, 3000);
    }
  };

  return (
    <section className="mb-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
          Bloques de Notas
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Se guardan automáticamente en el <strong>almacenamiento local</strong> de tu navegador
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={addBlock}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            + Agregar Bloque
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {blocks
          .slice()
          .reverse()
          .map((block) => (
            <div
              key={block.id}
              data-block-id={block.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2 gap-3">
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                  onFocus={() => {
                    if (editingBlockId !== block.id) {
                      saveCurrentEditing();
                      setEditingBlockId(block.id);
                      setEditingContent(block.content);
                    } else {
                      setEditingBlockId(block.id);
                    }
                  }}
                  onClick={() => {
                    if (editingBlockId !== block.id) {
                      saveCurrentEditing();
                      setEditingBlockId(block.id);
                      setEditingContent(block.content);
                    } else {
                      setEditingBlockId(block.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // si estamos editando este bloque, guardar contenido y salir de edición
                      if (editingBlockId === block.id) {
                        updateBlock(block.id, editingContent);
                        setEditingBlockId(null);
                        setEditingContent("");
                        // quitar focus del input
                        (e.target as HTMLInputElement).blur();
                      }
                    }
                  }}
                  className={`flex-1 text-sm font-medium px-2 py-1 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 ${editingBlockId === block.id
                    ? "bg-black text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  placeholder={`Nombre del bloque #${block.tag}...`}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyToClipboard(block.id, block.content)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer ${copiedBlockId === block.id
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    title="Copiar todo el texto"
                  >
                    {copiedBlockId === block.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleEditBlock(block)}
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    {editingBlockId === block.id ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar</span>
                      </>
                    ) : (
                      <>
                        <Pencil className="w-4 h-4" />
                        <span>Editar</span>
                      </>
                    )}
                  </button>

                  {editingBlockId === block.id && (
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors cursor-pointer ${deletingBlockId === block.id
                        ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 font-bold"
                        : "text-red-500 hover:text-red-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      aria-label={deletingBlockId === block.id ? " eliminación" : `Eliminar ${block.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{deletingBlockId === block.id ? "Seguro?" : "Eliminar"}</span>
                    </button>
                  )}
                </div>
              </div>

              {editingBlockId === block.id ? (
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      // Enter without Shift -> save and exit edit mode
                      e.preventDefault();
                      updateBlock(block.id, editingContent);
                      setEditingBlockId(null);
                      setEditingContent("");
                      (e.target as HTMLTextAreaElement).blur();
                    }
                    // Shift+Enter should insert newline (default behavior)
                  }}
                  placeholder="Escribe aquí..."
                  className="w-full min-h-[160px] p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-y bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap break-words break-all overflow-auto"
                />
              ) : (
                <div
                  className="w-full min-h-[160px] p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-y bg-white dark:bg-gray-800 text-black dark:text-white whitespace-pre-wrap break-words break-all overflow-auto"
                  // Mostrar contenido con links clicables y permitir click-to-edit salvo clicks en links

                  onDoubleClick={(e) => {
                    // si el target es un enlace o tiene un ancestro <a>, no entrar en modo edición
                    let node = e.target as HTMLElement | null;
                    while (node) {
                      if (node.tagName === "A") return;
                      node = node.parentElement;
                    }

                    // activar edición (guardar anterior si aplica)
                    saveCurrentEditing();
                    setEditingBlockId(block.id);
                    setEditingContent(block.content);
                  }}
                  dangerouslySetInnerHTML={{ __html: formatText(block.content) }}
                />
              )}
              <div className="text-xs text-gray-400 mt-2">
                {editingBlockId === block.id
                  ? editingContent.length
                  : block.content.length}{" "}
                caracteres
              </div>
            </div>
          ))}
      </div>

      <a
        href="https://github.com/gonzalogramagia/local"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group z-50"
        aria-label="GitHub Repository"
      >
        <Github className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors" />
      </a>
    </section>
  );
}
