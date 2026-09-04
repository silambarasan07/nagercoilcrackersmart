<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/src/SMTP.php';
require_once __DIR__ . '/../PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

try {
    $formType = trim($input['formType'] ?? 'contactEnquiry');

    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 0;

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'silambarasan07.k@gmail.com';
    $mail->Password = 'lyroqolwernrbevk';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('silambarasan07.k@gmail.com', 'Nagercoil Crackers Mart');
    $mail->addAddress('silambarasan07.k@gmail.com', 'Nagercoil Crackers Mart Admin');
    // $mail->addAddress('nagercoilcrackersmart@gmail.com', 'Nagercoil Crackers Mart Admin');
    // $mail->addBCC('rajeith.t@gmail.com', 'Nagercoil Crackers Mart Admin');


    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    date_default_timezone_set('Asia/Kolkata');
    $submittedAt24 = date('Y-m-d H:i');
    $submittedAt12 = date('Y-m-d h:i A');

    if ($formType === 'orderInquiry') {
        $customer = $input['customer'] ?? [];
        $items = $input['items'] ?? [];
        $totals = $input['totals'] ?? [];
        $invoiceNo = trim($input['invoiceNo'] ?? ('NCM-2026-' . rand(100000, 999999)));

        $custName = htmlspecialchars($customer['name'] ?? 'Customer');
        $custMobile = htmlspecialchars($customer['mobile'] ?? '');
        $custWhatsapp = htmlspecialchars($customer['whatsapp'] ?? '');
        $custAddress = htmlspecialchars($customer['address'] ?? '');
        $custCity = htmlspecialchars($customer['city'] ?? '');
        $custPincode = htmlspecialchars($customer['pincode'] ?? '');
        $custState = htmlspecialchars($customer['state'] ?? '');

        if (!empty($customer['email']) && filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
            $mail->addAddress($customer['email'], $custName);
            $mail->addReplyTo($customer['email'], $custName);
        } else if (!empty($customer['email'])) {
            $mail->addReplyTo($customer['email'], $custName);
        }

        $itemRowsHtml = '';
        foreach ($items as $item) {
            $name = htmlspecialchars($item['name'] ?? '');
            $pack = !empty($item['pack']) ? " (" . htmlspecialchars($item['pack']) . ")" : '';
            $qty = intval($item['qty'] ?? 1);
            $price = number_format(floatval($item['price'] ?? 0), 2);
            $total = number_format(floatval($item['total'] ?? 0), 2);

            $itemRowsHtml .= "
                <tr>
                    <td align='center' style='padding: 6px 4px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px;'>{$qty}</td>
                    <td style='padding: 6px 6px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; word-break: break-word;'>{$name}{$pack}</td>
                    <td align='right' style='padding: 6px 4px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; white-space: nowrap;'>₹{$price}</td>
                    <td align='right' style='padding: 6px 4px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px; font-weight: 600; white-space: nowrap;'>₹{$total}</td>
                </tr>
            ";
        }

        $subTotalFmt = number_format(floatval($totals['offerTotal'] ?? 0), 2);
        $packingFmt = number_format(floatval($totals['packing'] ?? 0), 2);
        $grandFmt = number_format(floatval($totals['grand'] ?? 0), 2);

        $mail->Subject = "New Diwali 2026 Order Invoice [{$invoiceNo}] - {$custName}";

        $mail->Body = "
        <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; box-sizing: border-box;'>
            <table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom: 12px;'>
                <tr>
                    <td valign='top' style='padding-right: 8px;'>
                        <h2 style='color: #800020; margin: 0; font-size: 18px; line-height: 1.2;'>Nagercoil Crackers Mart</h2>
                        <p style='color: #64748b; font-size: 11px; margin: 3px 0 0 0; line-height: 1.4;'>
                            Nagercoil, Kanyakumari Dist., Tamil Nadu — 629002<br>
                            Phone: +91 9790454711 / +91 8248159490
                        </p>
                    </td>
                    <td align='right' valign='top' style='white-space: nowrap;'>
                        <h1 style='color: #c0392b; font-size: 18px; margin: 0; text-transform: uppercase; line-height: 1.2;'>DIWALI INVOICE</h1>
                        <span style='color: #475569; font-size: 11px; font-weight: bold;'># {$invoiceNo}</span>
                    </td>
                </tr>
            </table>

            <table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom: 15px; border-top: 2px solid #c0392b; padding-top: 10px;'>
                <tr>
                    <td width='55%' valign='top' style='padding-right: 8px;'>
                        <strong style='color: #c0392b; font-size: 11px; text-transform: uppercase;'>BILL TO:</strong><br>
                        <b style='font-size: 13px; color: #0f172a;'>{$custName}</b><br>
                        <span style='font-size: 11.5px; color: #334155; line-height: 1.4; display: block; margin-top: 2px;'>
                            {$custAddress}<br>
                            {$custCity} - {$custPincode}, {$custState}<br>
                            Mobile: {$custMobile} | WA: {$custWhatsapp}
                        </span>
                    </td>
                    <td width='45%' align='right' valign='top' style='font-size: 11px; color: #334155; white-space: nowrap;'>
                        <p style='margin: 2px 0;'><strong>Date:</strong> {$submittedAt24}</p>
                        <p style='margin: 2px 0;'><strong>Status:</strong> <span style='color: #16a34a; font-weight: bold;'>Order Placed</span></p>
                    </td>
                </tr>
            </table>

            <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse; margin-bottom: 15px; width: 100%; table-layout: auto;'>
                <thead>
                    <tr style='background-color: #c0392b; color: #ffffff; font-size: 11px; text-transform: uppercase;'>
                        <th align='center' style='padding: 6px 4px; width: 35px;'>QTY</th>
                        <th align='left' style='padding: 6px 6px;'>Description</th>
                        <th align='right' style='padding: 6px 4px; white-space: nowrap;'>Unit Price</th>
                        <th align='right' style='padding: 6px 4px; white-space: nowrap;'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {$itemRowsHtml}
                </tbody>
            </table>

            <table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom: 15px;'>
                <tr>
                    <td width='35%'></td>
                    <td width='65%'>
                        <table width='100%' cellpadding='3' cellspacing='0' style='font-size: 12px; color: #334155;'>
                            <tr>
                                <td>Subtotal:</td>
                                <td align='right'>₹{$subTotalFmt}</td>
                            </tr>
                            <tr>
                                <td>Secured Packing:</td>
                                <td align='right'>₹{$packingFmt}</td>
                            </tr>
                            <tr style='border-top: 1.5px solid #c0392b; font-size: 14px; font-weight: bold; color: #c0392b;'>
                                <td style='padding-top: 6px;'>Total Amount:</td>
                                <td align='right' style='padding-top: 6px;'>₹{$grandFmt}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <div style='border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10.5px; color: #64748b; line-height: 1.4;'>
                <b>Bank Details:</b> Indian Overseas Bank | Account: 006301000046162 | IFSC: IOBA0000063 | UPI: itspjpradeep-1@okicici<br>
                Submitted on: {$submittedAt24} (24h) / {$submittedAt12} (12h)
            </div>
        </div>
        ";
    } else {
        $fullName = trim($input['fullName'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $message = trim($input['message'] ?? '');

        if ($fullName === '' || $phone === '') {
            throw new Exception('Required contact fields missing.');
        }

        $displayMessage = $message !== '' ? htmlspecialchars($message) : 'N/A (No specific message entered)';

        $mail->Subject = "Nagercoil Crackers Mart Enquiry - {$fullName}";
        $mail->Body = "
            <table width='600' border='1' style='border-collapse: collapse; font-family: Arial, sans-serif;'>
                <tr>
                    <td colspan='2' align='center' style='padding: 12px; background-color: #0284c7; color: #ffffff;'>
                        <b style='font-size: 16px;'>New Diwali 2026 Website Enquiry</b>
                    </td>
                </tr>
                <tr><td style='padding: 10px;'><strong>Full Name</strong></td><td style='padding: 10px;'>{$fullName}</td></tr>
                <tr><td style='padding: 10px;'><strong>Phone / Mobile</strong></td><td style='padding: 10px;'>{$phone}</td></tr>
                <tr><td style='padding: 10px;'><strong>Message</strong></td><td style='padding: 10px;'>" . nl2br($displayMessage) . "</td></tr>
                <tr>
                    <td colspan='2' style='padding: 10px; font-size: 11px; color: #64748b; background-color: #f8fafc;'>
                        Submitted on: {$submittedAt24} (24h) / {$submittedAt12} (12h)
                    </td>
                </tr>
            </table>
        ";
    }

    $mail->send();

    echo json_encode([
        'status' => 'success',
        'message' => 'Order invoice sent successfully via email!',
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send enquiry: ' . $e->getMessage(),
    ]);
}
