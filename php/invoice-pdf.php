<?php
require_once __DIR__ . '/fpdf/fpdf.php';

function pdfCleanStr($str): string
{
    if ($str === null || $str === '') {
        return '';
    }
    // 1. Decode HTML entities if present (e.g. &amp; -> &, &#039; -> ', &quot; -> ")
    $str = html_entity_decode((string)$str, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // 2. Map common unicode characters to clean ASCII
    $replacements = [
        '₹' => 'Rs. ',
        'Rs.' => 'Rs.',
        '•' => '*',
        '’' => "'",
        '‘' => "'",
        '“' => '"',
        '”' => '"',
        '–' => '-',
        '—' => '-',
        '…' => '...',
        '™' => 'TM',
        '®' => '(R)',
        '©' => '(C)',
    ];
    $str = str_replace(array_keys($replacements), array_values($replacements), $str);

    // 3. Convert UTF-8 to ISO-8859-1 safely for FPDF standard core fonts
    if (function_exists('iconv')) {
        $converted = @iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $str);
        if ($converted !== false) {
            return $converted;
        }
    }
    if (function_exists('mb_convert_encoding')) {
        return mb_convert_encoding($str, 'ISO-8859-1', 'UTF-8');
    }

    // 4. Fallback stripping of unsupported non-ASCII characters
    return preg_replace('/[^\x20-\x7E\xA0-\xFF]/', '', $str);
}

function generateInvoicePdfBuffer(array $invoiceData): string
{
    $pdf = new FPDF('P', 'mm', 'A4');
    $pdf->SetMargins(12, 12, 12);
    $pdf->SetAutoPageBreak(true, 15);
    $pdf->AddPage();

    $customer = $invoiceData['customer'] ?? [];
    $items = $invoiceData['items'] ?? [];
    $totals = $invoiceData['totals'] ?? [];
    $invoiceNo = pdfCleanStr($invoiceData['invoiceNo'] ?? ('NCM-2026-' . rand(100000, 999999)));
    $invoiceDate = pdfCleanStr($invoiceData['date'] ?? date('d-m-Y'));

    // Header Title Bar
    $pdf->SetFillColor(128, 0, 32); // Maroon Header
    $pdf->SetTextColor(255, 255, 255);
    $pdf->SetFont('Helvetica', 'B', 15);
    $pdf->Cell(186, 11, pdfCleanStr(' NAGERCOIL CRACKERS MART'), 0, 1, 'L', true);

    $pdf->Ln(2);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->SetFont('Helvetica', '', 8.5);
    $pdf->Cell(110, 4.5, pdfCleanStr('Nagercoil, Kanyakumari Dist., Tamil Nadu - 629002'), 0, 0, 'L');
    $pdf->SetFont('Helvetica', 'B', 13);
    $pdf->SetTextColor(192, 57, 43); // Red
    $pdf->Cell(76, 4.5, pdfCleanStr('ORDER INVOICE'), 0, 1, 'R');

    $pdf->SetFont('Helvetica', '', 8.5);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(110, 4.5, pdfCleanStr('Phone: +91 9790454711 / +91 8248159490'), 0, 0, 'L');
    $pdf->SetFont('Helvetica', 'B', 9.5);
    $pdf->SetTextColor(50, 50, 50);
    $pdf->Cell(76, 4.5, pdfCleanStr('Invoice #: ' . $invoiceNo), 0, 1, 'R');

    $pdf->SetFont('Helvetica', '', 8.5);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(110, 4.5, pdfCleanStr('Email: info@nagercoilcrackersmart.com'), 0, 0, 'L');
    $pdf->Cell(76, 4.5, pdfCleanStr('Date: ' . $invoiceDate), 0, 1, 'R');

    $pdf->Ln(3);
    $pdf->SetDrawColor(200, 200, 200);
    $pdf->Line(12, $pdf->GetY(), 198, $pdf->GetY());
    $pdf->Ln(3);

    // Bill To & Order Status
    $custName = pdfCleanStr($customer['name'] ?? 'Valued Customer');
    $custMobile = pdfCleanStr($customer['mobile'] ?? '');
    $custWhatsapp = pdfCleanStr($customer['whatsapp'] ?? '');
    $custAddress = pdfCleanStr($customer['address'] ?? '');
    $custCity = pdfCleanStr($customer['city'] ?? '');
    $custPincode = pdfCleanStr($customer['pincode'] ?? '');
    $custState = pdfCleanStr($customer['state'] ?? '');

    $pdf->SetFont('Helvetica', 'B', 9.5);
    $pdf->SetTextColor(192, 57, 43);
    $pdf->Cell(110, 5, pdfCleanStr('BILL TO:'), 0, 0, 'L');
    $pdf->SetTextColor(22, 163, 74);
    $pdf->Cell(76, 5, pdfCleanStr('Status: Order Placed / Pending Payment'), 0, 1, 'R');

    $pdf->SetFont('Helvetica', 'B', 10.5);
    $pdf->SetTextColor(30, 41, 59);
    $pdf->Cell(186, 5, $custName, 0, 1, 'L');

    $pdf->SetFont('Helvetica', '', 9);
    $pdf->SetTextColor(71, 85, 105);
    $fullAddress = pdfCleanStr(trim("{$custAddress}, {$custCity} - {$custPincode}, {$custState}", " ,-"));
    $pdf->MultiCell(186, 4.2, $fullAddress, 0, 'L');
    $pdf->Cell(186, 4.5, pdfCleanStr("Mobile: {$custMobile}  |  WhatsApp: {$custWhatsapp}"), 0, 1, 'L');

    $pdf->Ln(3);

    // Table Header
    $pdf->SetFillColor(192, 57, 43); // Red Header Table
    $pdf->SetTextColor(255, 255, 255);
    $pdf->SetFont('Helvetica', 'B', 8.5);
    $pdf->Cell(15, 6.5, pdfCleanStr('QTY'), 1, 0, 'C', true);
    $pdf->Cell(111, 6.5, pdfCleanStr('DESCRIPTION'), 1, 0, 'L', true);
    $pdf->Cell(30, 6.5, pdfCleanStr('UNIT PRICE'), 1, 0, 'R', true);
    $pdf->Cell(30, 6.5, pdfCleanStr('AMOUNT'), 1, 1, 'R', true);

    $pdf->SetTextColor(30, 41, 59);
    $pdf->SetFont('Helvetica', '', 8.5);

    $fill = false;
    if (is_array($items) && count($items) > 0) {
        foreach ($items as $item) {
            $name = pdfCleanStr($item['name'] ?? '');
            $pack = !empty($item['pack']) ? pdfCleanStr(" ({$item['pack']})") : '';
            $qty = intval($item['qty'] ?? 1);
            $price = number_format(floatval($item['price'] ?? 0), 2);
            $total = number_format(floatval($item['total'] ?? 0), 2);

            $pdf->SetFillColor($fill ? 248 : 255, $fill ? 250 : 255, $fill ? 252 : 255);
            $pdf->Cell(15, 6, $qty, 'LRB', 0, 'C', true);
            $pdf->Cell(111, 6, " {$name}{$pack}", 'LRB', 0, 'L', true);
            $pdf->Cell(30, 6, pdfCleanStr("Rs. {$price}"), 'LRB', 0, 'R', true);
            $pdf->Cell(30, 6, pdfCleanStr("Rs. {$total}"), 'LRB', 1, 'R', true);
            $fill = !$fill;
        }
    } else {
        $pdf->Cell(186, 8, pdfCleanStr('No item details recorded'), 1, 1, 'C');
    }

    // Totals Box
    $offerTotal = floatval($totals['offerTotal'] ?? 0);
    $packing = floatval($totals['packing'] ?? 0);
    $grand = floatval($totals['grand'] ?? 0);

    $pdf->Ln(2);
    $pdf->SetFont('Helvetica', '', 9);
    $pdf->Cell(126, 5.5, '', 0, 0);
    $pdf->Cell(30, 5.5, pdfCleanStr('Subtotal:'), 0, 0, 'L');
    $pdf->Cell(30, 5.5, pdfCleanStr('Rs. ' . number_format($offerTotal, 2)), 0, 1, 'R');

    $pdf->Cell(126, 5.5, '', 0, 0);
    $pdf->Cell(30, 5.5, pdfCleanStr('Secured Packing:'), 0, 0, 'L');
    $pdf->Cell(30, 5.5, pdfCleanStr('Rs. ' . number_format($packing, 2)), 0, 1, 'R');

    $pdf->SetFont('Helvetica', 'B', 10.5);
    $pdf->SetTextColor(192, 57, 43);
    $pdf->Cell(126, 7, '', 0, 0);
    $pdf->Cell(30, 7, pdfCleanStr('Total Amount:'), 'T', 0, 'L');
    $pdf->Cell(30, 7, pdfCleanStr('Rs. ' . number_format($grand, 2)), 'T', 1, 'R');

    // Footer Info Box
    $pdf->Ln(5);
    $pdf->SetDrawColor(226, 232, 240);
    $pdf->SetFillColor(248, 250, 252);
    $pdf->SetFont('Helvetica', 'B', 8.5);
    $pdf->SetTextColor(192, 57, 43);
    $pdf->Cell(91, 5, pdfCleanStr('TERMS & CONDITIONS'), 'LRT', 0, 'L', true);
    $pdf->Cell(4, 5, '', 0, 0);
    $pdf->Cell(91, 5, pdfCleanStr('BANK PAYMENT DETAILS'), 'LRT', 1, 'L', true);

    $pdf->SetFont('Helvetica', '', 7.5);
    $pdf->SetTextColor(100, 116, 139);

    $xLeft = 12;
    $xRight = 107;
    $yStart = $pdf->GetY();

    // Terms (Left Column)
    $pdf->SetXY($xLeft, $yStart);
    $pdf->Cell(91, 4.2, pdfCleanStr('1. Prices are net wholesale for Diwali 2026.'), 'LR', 1, 'L', true);
    $pdf->SetX($xLeft);
    $pdf->Cell(91, 4.2, pdfCleanStr('2. Free door delivery within 20km of Nagercoil.'), 'LR', 1, 'L', true);
    $pdf->SetX($xLeft);
    $pdf->Cell(91, 4.2, pdfCleanStr('3. Handle crackers with care under adult supervision.'), 'LRB', 1, 'L', true);
    $yTermsEnd = $pdf->GetY();

    // Bank Details (Right Column)
    $pdf->SetXY($xRight, $yStart);
    $pdf->Cell(91, 4.2, pdfCleanStr('Bank: Indian Overseas Bank (IOB)'), 'LR', 1, 'L', true);
    $pdf->SetX($xRight);
    $pdf->Cell(91, 4.2, pdfCleanStr('A/C Name: PRADEEP PJ  |  A/C No: 006301000046162'), 'LR', 1, 'L', true);
    $pdf->SetX($xRight);
    $pdf->Cell(91, 4.2, pdfCleanStr('IFSC: IOBA0000063  |  UPI: itspjpradeep-1@okicici'), 'LRB', 1, 'L', true);
    $yBankEnd = $pdf->GetY();

    $pdf->SetY(max($yTermsEnd, $yBankEnd) + 4);
    $pdf->SetFont('Helvetica', 'I', 8);
    $pdf->SetTextColor(148, 163, 184);
    $pdf->Cell(186, 4.5, pdfCleanStr('Thank you for your business! - Nagercoil Crackers Mart'), 0, 1, 'C');

    return $pdf->Output('S');
}
