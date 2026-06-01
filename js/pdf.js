function generatePDF() {

  const content =
    document.getElementById("previewArea");

  if (!content) return;

  const printWindow =
    window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>Affidavit PDF</title>

        <style>
          body{
            font-family:Arial,sans-serif;
            padding:20px;
          }
        </style>

      </head>

      <body>
        ${content.innerHTML}
      </body>

    </html>
  `);

  printWindow.document.close();
  printWindow.print();

}
