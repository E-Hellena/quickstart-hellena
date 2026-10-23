import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProductComments, getCommentById, createComment, updateComment, deleteComment } from "@/actions/comments";

interface ListCommentsParams { stockId: string; page?: number; limit?: number; }
interface CreateCommentPayload {
    stockId: string; content: string; customerId?: string; customerName?: string;
    customerEmail?: string; parentId?: string; reactions?: string;
}
interface UpdateCommentPayload { content?: string; reactions?: string; }

export function useProductComments({ stockId, page = 1, limit = 10 }: ListCommentsParams) {
    return useQuery({
        queryKey: ["comments", "product", stockId, { page, limit }],
        queryFn: () => listProductComments({ stockId, page, limit }),
        enabled: Boolean(stockId),
    });
}

export function useCommentById(commentId: string) {
    return useQuery({
        queryKey: ["comments", commentId],
        queryFn: () => getCommentById(commentId),
        enabled: Boolean(commentId),
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCommentPayload) => createComment(payload),
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["comments", "product", variables.stockId] }),
    });
}

export function useUpdateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCommentPayload }) => updateComment(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments"] }),
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments"] }),
    });
}
