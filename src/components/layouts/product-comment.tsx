"use client"

import Image from "next/image";
import { Send } from "lucide-react";
import { useProductComments, useCreateComment } from "@/hooks/useComments";
import { ProductDTO } from "@hellena-sdk/hellena";
import { useState } from "react";
import { CommentsSkeleton } from "../skeleton/ProductSkeleton";

export default function ProductComments({ product }: { product: ProductDTO }) {
    const { data: commentsList, isLoading } = useProductComments({ stockId: product.id, page: 1, limit: 10 });
    const createCommentMutation = useCreateComment();
    const [newComment, setNewComment] = useState("");

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        createCommentMutation.mutate(
            {
                stockId: product.id,
                content: newComment,
                customerName: "Cliente",
            },
            {
                onSuccess: () => {
                    setNewComment("");
                },
            }
        );
    };

    if (isLoading) return <CommentsSkeleton />

    return (
        <>
            <form onSubmit={handleAddComment} className="mt-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Escreva o seu comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 border p-2 rounded-md text-sm bg-background focus:outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={createCommentMutation.isPending || !newComment.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm flex items-center gap-1 disabled:opacity-50"
                >
                    <Send className="h-4 w-4" />
                    {createCommentMutation.isPending ? "A enviar..." : "Publicar"}
                </button>
            </form>

            {/* Lista de Comentários */}
            <div className="mt-6 divide-y">
                {isLoading ? (
                    <p className="py-6 text-xs text-muted-foreground">A carregar comentários...</p>
                ) : commentsList?.data.length === 0 ? (
                    <p className="py-6 text-sm text-muted-foreground">Ainda não há comentários para este produto.</p>
                ) : (
                    commentsList?.data.map((c: any) => (
                        <div key={c.id} className="py-6">
                            <div className="flex items-center gap-3">
                                {c.customerProfile ? (
                                    <Image
                                        src={c.customerProfile}
                                        alt={c.customerName || "customer"}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-surface border flex items-center justify-center text-xs font-bold uppercase">
                                        {(c.customerName || "A")[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-medium">
                                        {c.customerName || "Cliente Anónimo"}
                                        <span className="ml-2 font-normal text-muted-foreground">
                                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString("pt-AO") : ""}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 pl-11 text-sm leading-relaxed">{c.content}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}