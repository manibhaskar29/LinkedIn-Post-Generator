// Export utilities for Posts

export function exportToCSV(posts) {
    // CSV headers
    const headers = ["Date", "Tone", "Engagement Score", "Favorite", "Content"];

    // Convert posts to CSV rows
    const rows = posts.map(post => [
        new Date(post.created_at).toLocaleDateString(),
        post.tone || "",
        post.engagement_score || 0,
        post.is_favorite ? "Yes" : "No",
        `"${(post.content || "").replace(/"/g, '""')}"` // Escape quotes
    ]);

    // Combine headers and rows
    const csv = [headers, ...rows]
        .map(row => row.join(","))
        .join("\\n");

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `posts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportToPDF(posts) {
    // Simple PDF export using HTML to print
    const printWindow = window.open('', '', 'height=600,width=800');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>LinkedIn Posts Export</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #0077B5; }
                .post { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                .meta { color: #666; font-size: 14px; margin-bottom: 10px; }
                .content { white-space: pre-wrap; line-height: 1.6; }
                @media print {
                    .post { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <h1>LinkedIn Posts Export</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            ${posts.map(post => `
                <div class="post">
                    <div class="meta">
                        <strong>${new Date(post.created_at).toLocaleDateString()}</strong> | 
                        Tone: ${post.tone || 'N/A'} | 
                        Engagement: ${post.engagement_score || 0}/10
                        ${post.is_favorite ? ' | ⭐ Favorite' : ''}
                    </div>
                    <div class="content">${post.content || ''}</div>
                </div>
            `).join('')}
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}
