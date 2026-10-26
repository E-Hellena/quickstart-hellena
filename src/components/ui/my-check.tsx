export function MyCheck({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
            <input type="checkbox" checked={on} onChange={toggle} className="accent-primary cursor-pointer" />
            {label}
        </label>
    );
}