<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/invoice-pdf.php';

$rawInput = file_get_contents('php://input');
$input = (!empty($rawInput) ? json_decode($rawInput, true) : null) ?: $_POST ?: $_GET;

if (empty($input) && !empty($_GET['data'])) {
    $input = json_decode(base64_decode($_GET['data']), true);
}

if (!is_array($input)) {
    $input = [];
}

try {
    $invoiceNo = trim($input['invoiceNo'] ?? ('NCM-2026-' . rand(100000, 999999)));
    $pdfBuffer = generateInvoicePdfBuffer($input);

    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Order_Invoice_' . $invoiceNo . '.pdf"');
    header('Content-Length: ' . strlen($pdfBuffer));
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');

    echo $pdfBuffer;
    exit();
} catch (\Throwable $e) {
    http_response_code(500);
    echo "Error generating invoice PDF: " . $e->getMessage();
}
