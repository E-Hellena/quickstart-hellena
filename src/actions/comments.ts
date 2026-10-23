"use server";

import { hellena } from "@/lib/hellena";

export async function listProductComments(params: { stockId: string; page?: number; limit?: number }) {
    return hellena.comment.listProductComments(params);
}
export async function getCommentById(commentId: string) {
    return hellena.comment.getCommentById(commentId);
}
export async function createComment(payload: {
    stockId: string; content: string; customerId?: string; customerName?: string;
    customerEmail?: string; parentId?: string; reactions?: string;
}) {
    return hellena.comment.createComment(payload);
}
export async function updateComment(id: string, data: { content?: string; reactions?: string }) {
    return hellena.comment.updateComment(id, data);
}
export async function deleteComment(commentId: string) {
    return hellena.comment.deleteComment(commentId);
}
