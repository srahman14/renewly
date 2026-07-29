export async function deleteAccount(): Promise<void> {
    const response = await fetch("/api/account", { method: "DELETE" });
    
    if (!response.ok) { 
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to delete account");
    }
}