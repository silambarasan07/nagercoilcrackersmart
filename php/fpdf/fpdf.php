<?php
/*******************************************************************************
* FPDF                                                                         *
*                                                                              *
* Version:  1.86                                                               *
* Date:     2023-06-25                                                         *
* Author:   Olivier PLATHEY                                                    *
*******************************************************************************/

define('FPDF_VERSION','1.86');

class FPDF
{
protected $page;               // current page number
protected $n;                  // current object number
protected $offsets;            // array of object offsets
protected $buffer;             // buffer holding in-memory PDF
protected $pages;              // array containing pages
protected $state;              // current document state
protected $compress;           // compression flag
protected $k;                  // scale factor (number of points in user unit)
protected $DefOrientation;     // default orientation
protected $CurOrientation;     // current orientation
protected $StdPageSizes;       // standard page sizes
protected $DefPageSize;        // default page size
protected $CurPageSize;        // current page size
protected $CurRotation;        // current page rotation
protected $PageInfo;           // page-related data
protected $wPt, $hPt;          // dimensions of current page in points
protected $w, $h;              // dimensions of current page in user units
protected $lMargin;            // left margin
protected $tMargin;            // top margin
protected $rMargin;            // right margin
protected $bMargin;            // page break margin
protected $cMargin;            // cell margin
protected $x, $y;              // current position in user units
protected $lasth;              // height of last printed cell
protected $LineWidth;          // line width in user units
protected $fontpath;           // path containing fonts
protected $CoreFonts;          // array of core font names
protected $fonts;              // array of used fonts
protected $FontFiles;          // array of font files
protected $encodings;          // array of encodings
protected $cmaps;              // array of ToUnicode CMaps
protected $FontFamily;         // current font family
protected $FontStyle;          // current font style
protected $underline;          // underlining flag
protected $CurrentFont;        // current font info
protected $FontSizePt;         // current font size in points
protected $FontSize;           // current font size in user units
protected $DrawColor;          // commands for drawing color
protected $FillColor;          // commands for filling color
protected $TextColor;          // commands for text color
protected $ColorFlag;          // indicates whether fill and text colors are different
protected $WithAlpha;          // indicates whether alpha channel is used
protected $ws;                 // word spacing
protected $images;             // array of used images
protected $PageLinks;          // array of links in pages
protected $links;              // array of internal links
protected $AutoPageBreak;      // automatic page breaking
protected $PageBreakTrigger;   // threshold page break trigger
protected $InHeader;           // flag set when processing header
protected $InFooter;           // flag set when processing footer
protected $AliasNbPages;       // alias for total number of pages
protected $ZoomMode;           // zoom display mode
protected $LayoutMode;         // layout display mode
protected $metadata;           // document properties
protected $PDFVersion;         // PDF version number

function __construct($orientation='P', $unit='mm', $size='A4')
{
	$this->_dochecks();
	$this->state = 0;
	$this->page = 0;
	$this->n = 2;
	$this->buffer = '';
	$this->pages = array();
	$this->PageInfo = array();
	$this->fonts = array();
	$this->FontFiles = array();
	$this->encodings = array();
	$this->cmaps = array();
	$this->images = array();
	$this->links = array();
	$this->InHeader = false;
	$this->InFooter = false;
	$this->AliasNbPages = '';
	$this->DefOrientation = $orientation;
	$this->CurOrientation = $orientation;
	$this->k = 72/25.4;
	$this->LineWidth = 0.567/$this->k;
	$this->CoreFonts = array('courier', 'helvetica', 'times', 'symbol', 'zapfdingbats');
	$this->lMargin = 10;
	$this->tMargin = 10;
	$this->rMargin = 10;
	$this->bMargin = 10;
	$this->cMargin = 1;
	$this->x = 10;
	$this->y = 10;
	$this->lasth = 0;
	$this->FontFamily = '';
	$this->FontStyle = '';
	$this->FontSizePt = 12;
	$this->FontSize = 12/$this->k;
	$this->DrawColor = '0 G';
	$this->FillColor = '0 g';
	$this->TextColor = '0 g';
	$this->ColorFlag = false;
	$this->WithAlpha = false;
	$this->ws = 0;
	$this->StdPageSizes = array('a3'=>array(841.89,1190.55), 'a4'=>array(595.28,841.89), 'a5'=>array(420.94,595.28),
		'letter'=>array(612,792), 'legal'=>array(612,1008));
	$size = $this->_getpagesize($size);
	$this->DefPageSize = $size;
	$this->CurPageSize = $size;
	if($orientation=='P' || $orientation=='PORTRAIT')
	{
		$this->wPt = $size[0]*$this->k;
		$this->hPt = $size[1]*$this->k;
	}
	else
	{
		$this->wPt = $size[1]*$this->k;
		$this->hPt = $size[0]*$this->k;
	}
	$this->w = $size[0];
	$this->h = $size[1];
	$this->PageBreakTrigger = $this->h - $this->bMargin;
	$this->AutoPageBreak = true;
	$this->bMargin = 10;
	$this->ZoomMode = 'default';
	$this->LayoutMode = 'default';
	$this->metadata = array('Title'=>'', 'Subject'=>'', 'Author'=>'', 'Keywords'=>'', 'Creator'=>'');
	$this->PDFVersion = '1.3';
}

function SetMargins($left, $top, $right=null)
{
	$this->lMargin = $left;
	$this->tMargin = $top;
	$this->rMargin = ($right===null) ? $left : $right;
}

function SetLeftMargin($margin)
{
	$this->lMargin = $margin;
	if($this->page>0 && $this->x<$margin)
		$this->x = $margin;
}

function SetTopMargin($margin)
{
	$this->tMargin = $margin;
}

function SetRightMargin($margin)
{
	$this->rMargin = $margin;
}

function SetAutoPageBreak($auto, $margin=0)
{
	$this->AutoPageBreak = $auto;
	$this->bMargin = $margin;
	$this->PageBreakTrigger = $this->h - $margin;
}

function SetDisplayMode($zoom, $layout='default')
{
	if($zoom=='fullpage' || $zoom=='fullwidth' || $zoom=='real' || $zoom=='default' || !is_string($zoom))
		$this->ZoomMode = $zoom;
	else
		$this->Error('Incorrect zoom display mode: '.$zoom);
	if($layout=='single' || $layout=='continuous' || $layout=='two' || $layout=='default')
		$this->LayoutMode = $layout;
	else
		$this->Error('Incorrect layout display mode: '.$layout);
}

function SetCompression($compress)
{
	if(function_exists('gzcompress'))
		$this->compress = $compress;
	else
		$this->compress = false;
}

function SetTitle($title, $isUTF8=false)
{
	$this->metadata['Title'] = $isUTF8 ? $title : utf8_encode($title);
}

function SetAuthor($author, $isUTF8=false)
{
	$this->metadata['Author'] = $isUTF8 ? $author : utf8_encode($author);
}

function SetSubject($subject, $isUTF8=false)
{
	$this->metadata['Subject'] = $isUTF8 ? $subject : utf8_encode($subject);
}

function SetKeywords($keywords, $isUTF8=false)
{
	$this->metadata['Keywords'] = $isUTF8 ? $keywords : utf8_encode($keywords);
}

function SetCreator($creator, $isUTF8=false)
{
	$this->metadata['Creator'] = $isUTF8 ? $creator : utf8_encode($creator);
}

function AliasNbPages($alias='{nb}')
{
	$this->AliasNbPages = $alias;
}

function Error($msg)
{
	throw new Exception('FPDF error: '.$msg);
}

function Open()
{
	$this->state = 1;
}

function Close()
{
	if($this->state==3)
		return;
	if($this->page==0)
		$this->AddPage();
	$this->InFooter = true;
	$this->Footer();
	$this->InFooter = false;
	$this->_endpage();
	$this->_enddoc();
}

function AddPage($orientation='', $size='', $rotation=0)
{
	if($this->state==0)
		$this->Open();
	$family = $this->FontFamily;
	$style = $this->FontStyle.($this->underline ? 'U' : '');
	$fontsize = $this->FontSizePt;
	$lw = $this->LineWidth;
	$dc = $this->DrawColor;
	$fc = $this->FillColor;
	$tc = $this->TextColor;
	$cf = $this->ColorFlag;

	if($this->page>0)
	{
		$this->InFooter = true;
		$this->Footer();
		$this->InFooter = false;
		$this->_endpage();
	}

	$this->_beginpage($orientation, $size, $rotation);
	$this->_pageobj();
	$this->x = $this->lMargin;
	$this->y = $this->tMargin;
	$this->FontFamily = '';
	if($family)
		$this->SetFont($family, $style, $fontsize);
	if($lw!=$this->LineWidth)
	{
		$this->LineWidth = $lw;
		$this->_out(sprintf('%.2F w', $lw*$this->k));
	}
	if($dc!=$this->DrawColor)
	{
		$this->DrawColor = $dc;
		$this->_out($dc);
	}
	if($fc!=$this->FillColor)
	{
		$this->FillColor = $fc;
		$this->_out($fc);
	}
	$this->TextColor = $tc;
	$this->ColorFlag = $cf;

	$this->InHeader = true;
	$this->Header();
	$this->InHeader = false;
	if($this->LineWidth!=$lw)
	{
		$this->LineWidth = $lw;
		$this->_out(sprintf('%.2F w', $lw*$this->k));
	}
	if($this->FontFamily!=$family || $this->FontStyle!=$style || $this->FontSizePt!=$fontsize)
		$this->SetFont($family, $style, $fontsize);
	if($this->DrawColor!=$dc)
	{
		$this->DrawColor = $dc;
		$this->_out($dc);
	}
	if($this->FillColor!=$fc)
	{
		$this->FillColor = $fc;
		$this->_out($fc);
	}
	$this->TextColor = $tc;
	$this->ColorFlag = $cf;
}

function Header() {}

function Footer() {}

function AcceptPageBreak()
{
	return $this->AutoPageBreak;
}

function PageNo()
{
	return $this->page;
}

function SetDrawColor($r, $g=null, $b=null)
{
	if(($r==0 && $g==0 && $b==0) || $g===null)
		$this->DrawColor = sprintf('%.3F G', $r/255);
	else
		$this->DrawColor = sprintf('%.3F %.3F %.3F RG', $r/255, $g/255, $b/255);
	if($this->page>0)
		$this->_out($this->DrawColor);
}

function SetFillColor($r, $g=null, $b=null)
{
	if(($r==0 && $g==0 && $b==0) || $g===null)
		$this->FillColor = sprintf('%.3F g', $r/255);
	else
		$this->FillColor = sprintf('%.3F %.3F %.3F rg', $r/255, $g/255, $b/255);
	$this->ColorFlag = ($this->FillColor!=$this->TextColor);
	if($this->page>0)
		$this->_out($this->FillColor);
}

function SetTextColor($r, $g=null, $b=null)
{
	if(($r==0 && $g==0 && $b==0) || $g===null)
		$this->TextColor = sprintf('%.3F g', $r/255);
	else
		$this->TextColor = sprintf('%.3F %.3F %.3F rg', $r/255, $g/255, $b/255);
	$this->ColorFlag = ($this->FillColor!=$this->TextColor);
}

function GetStringWidth($s)
{
	$s = (string)$s;
	$cw = &$this->CurrentFont['cw'];
	$w = 0;
	$l = strlen($s);
	for($i=0;$i<$l;$i++)
		$w += $cw[$s[$i]] ?? 600;
	return $w*$this->FontSize/1000;
}

function SetLineWidth($width)
{
	$this->LineWidth = $width;
	if($this->page>0)
		$this->_out(sprintf('%.2F w', $width*$this->k));
}

function Line($x1, $y1, $x2, $y2)
{
	$this->_out(sprintf('%.2F %.2F m %.2F %.2F l S', $x1*$this->k, ($this->h-$y1)*$this->k, $x2*$this->k, ($this->h-$y2)*$this->k));
}

function Rect($x, $y, $w, $h, $style='')
{
	if($style=='F')
		$op = 'f';
	elseif($style=='FD' || $style=='DF')
		$op = 'B';
	else
		$op = 'S';
	$this->_out(sprintf('%.2F %.2F %.2F %.2F re %s', $x*$this->k, ($this->h-$y)*$this->k, $w*$this->k, -$h*$this->k, $op));
}

function SetFont($family, $style='', $size=0)
{
	if($family=='')
		$family = $this->FontFamily;
	else
		$family = strtolower($family);
	if($family=='arial')
		$family = 'helvetica';
	$style = strtoupper($style);
	if(strpos($style,'U')!==false)
	{
		$this->underline = true;
		$style = str_replace('U','',$style);
	}
	else
		$this->underline = false;
	if($style=='IB')
		$style = 'BI';
	if($size==0)
		$size = $this->FontSizePt;

	if($this->FontFamily==$family && $this->FontStyle==$style && $this->FontSizePt==$size)
		return;

	$fontkey = $family.$style;
	if(!isset($this->fonts[$fontkey]))
	{
		if(in_array($family, $this->CoreFonts))
		{
			if($family=='symbol' || $family=='zapfdingbats')
				$style = '';
			$fontkey = $family.$style;
			if(!isset($this->fonts[$fontkey]))
				$this->_loadfont($family, $style);
		}
		else
			$this->Error('Undefined font: '.$family.' '.$style);
	}

	$this->FontFamily = $family;
	$this->FontStyle = $style;
	$this->FontSizePt = $size;
	$this->FontSize = $size/$this->k;
	$this->CurrentFont = &$this->fonts[$fontkey];
}

function SetFontSize($size)
{
	if($this->FontSizePt==$size)
		return;
	$this->FontSizePt = $size;
	$this->FontSize = $size/$this->k;
}

function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
{
	$k = $this->k;
	if($this->y+$h>$this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak())
	{
		$x = $this->x;
		$ws = $this->ws;
		if($ws>0)
		{
			$this->ws = 0;
			$this->_out('0 Tw');
		}
		$this->AddPage($this->CurOrientation, $this->CurPageSize, $this->CurRotation);
		$this->x = $x;
		if($ws>0)
		{
			$this->ws = $ws;
			$this->_out(sprintf('%.3F Tw', $ws*$k));
		}
	}
	if($w==0)
		$w = $this->w - $this->rMargin - $this->x;
	$s = '';
	if($fill || $border==1)
	{
		if($fill)
			$op = ($border==1) ? 'B' : 'f';
		else
			$op = 'S';
		$s = sprintf('%.2F %.2F %.2F %.2F re %s ', $this->x*$k, ($this->h-$this->y)*$k, $w*$k, -$h*$k, $op);
	}
	if(is_string($border))
	{
		$x = $this->x;
		$y = $this->y;
		if(strpos($border,'L')!==false)
			$s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x*$k, ($this->h-$y)*$k, $x*$k, ($this->h-($y+$h))*$k);
		if(strpos($border,'T')!==false)
			$s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x*$k, ($this->h-$y)*$k, ($x+$w)*$k, ($this->h-$y)*$k);
		if(strpos($border,'R')!==false)
			$s .= sprintf('%.2F %.2F m %.2F %.2F l S ', ($x+$w)*$k, ($this->h-$y)*$k, ($x+$w)*$k, ($this->h-($y+$h))*$k);
		if(strpos($border,'B')!==false)
			$s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x*$k, ($this->h-($y+$h))*$k, ($x+$w)*$k, ($this->h-($y+$h))*$k);
	}
	if($txt!=='')
	{
		$txt = (string)$txt;
		if($align=='R')
			$dx = $w - $this->cMargin - $this->GetStringWidth($txt);
		elseif($align=='C')
			$dx = ($w - $this->GetStringWidth($txt))/2;
		else
			$dx = $this->cMargin;
		if($this->ColorFlag)
			$s .= 'q '.$this->TextColor.' ';
		$txtstring = $this->_escape($txt);
		$s .= sprintf('BT /F%d %.2F Tf %.2F %.2F Td (%s) Tj ET', $this->CurrentFont['i'], $this->FontSizePt, ($this->x+$dx)*$k, ($this->h-($this->y+0.5*$h+0.3*$this->FontSize))*$k, $txtstring);
		if($this->underline)
			$s .= ' '.$this->_dounderline($this->x+$dx, $this->y+0.5*$h+0.3*$this->FontSize, $txt);
		if($this->ColorFlag)
			$s .= ' Q';
	}
	if($s)
		$this->_out($s);
	$this->lasth = $h;
	if($ln>0)
	{
		$this->y += $h;
		if($ln==1)
			$this->x = $this->lMargin;
	}
	else
		$this->x += $w;
}

function MultiCell($w, $h, $txt, $border=0, $align='J', $fill=false)
{
	$cw = &$this->CurrentFont['cw'];
	if($w==0)
		$w = $this->w - $this->rMargin - $this->x;
	$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
	$s = str_replace("\r", '', (string)$txt);
	$nb = strlen($s);
	if($nb>0 && $s[$nb-1]=="\n")
		$nb--;
	$b = 0;
	if($border)
	{
		if($border==1)
		{
			$border = 'LRTB';
			$b = 'LRT';
			$b2 = 'LRB';
		}
		else
		{
			$b2 = '';
			if(strpos($border,'L')!==false) $b2 .= 'L';
			if(strpos($border,'R')!==false) $b2 .= 'R';
			if(strpos($border,'B')!==false) $b2 .= 'B';
		}
	}
	$sep = -1;
	$i = 0;
	$j = 0;
	$l = 0;
	$ns = 0;
	$nl = 1;
	while($i<$nb)
	{
		$c = $s[$i];
		if($c=="\n")
		{
			$this->Cell($w, $h, substr($s, $j, $i-$j), $b, 2, $align, $fill);
			$i++;
			$sep = -1;
			$j = $i;
			$l = 0;
			$ns = 0;
			$nl++;
			if($border && $nl==2)
				$b = $b2;
			continue;
		}
		if($c==' ')
		{
			$sep = $i;
			$ns++;
		}
		$l += $cw[$c] ?? 600;
		if($l>$wmax)
		{
			if($sep==-1)
			{
				if($i==$j)
					$i++;
				$this->Cell($w, $h, substr($s, $j, $i-$j), $b, 2, $align, $fill);
			}
			else
			{
				$this->Cell($w, $h, substr($s, $j, $sep-$j), $b, 2, $align, $fill);
				$i = $sep + 1;
			}
			$sep = -1;
			$j = $i;
			$l = 0;
			$ns = 0;
			$nl++;
			if($border && $nl==2)
				$b = $b2;
		}
		else
			$i++;
	}
	if($border && strpos($border,'B')!==false)
		$b .= 'B';
	$this->Cell($w, $h, substr($s, $j, $i-$j), $b, 2, $align, $fill);
	$this->x = $this->lMargin;
}

function Ln($h=null)
{
	$this->x = $this->lMargin;
	if($h===null)
		$this->y += $this->lasth;
	else
		$this->y += $h;
}

function GetX()
{
	return $this->x;
}

function SetX($x)
{
	if($x>=0)
		$this->x = $x;
	else
		$this->x = $this->w + $x;
}

function GetY()
{
	return $this->y;
}

function SetY($y)
{
	$this->x = $this->lMargin;
	if($y>=0)
		$this->y = $y;
	else
		$this->y = $this->h + $y;
}

function SetXY($x, $y)
{
	$this->SetY($y);
	$this->SetX($x);
}

function Output($dest='', $name='', $isUTF8=false)
{
	if($this->state<3)
		$this->Close();
	$dest = strtoupper($dest);
	if($dest=='')
	{
		if($name=='')
		{
			$name = 'doc.pdf';
			$dest = 'I';
		}
		else
			$dest = 'F';
	}
	switch($dest)
	{
		case 'I':
			$this->_checkoutput();
			if(PHP_SAPI!='cli')
			{
				header('Content-Type: application/pdf');
				header('Content-Disposition: inline; '.$this->_httpdigest($name, $isUTF8));
				header('Cache-Control: private, max-age=0, must-revalidate');
				header('Pragma: public');
			}
			echo $this->buffer;
			break;
		case 'D':
			$this->_checkoutput();
			header('Content-Type: application/x-download');
			header('Content-Disposition: attachment; '.$this->_httpdigest($name, $isUTF8));
			header('Cache-Control: private, max-age=0, must-revalidate');
			header('Pragma: public');
			echo $this->buffer;
			break;
		case 'F':
			$f = fopen($name, 'wb');
			if(!$f)
				$this->Error('Unable to create output file: '.$name);
			fwrite($f, $this->buffer, strlen($this->buffer));
			fclose($f);
			break;
		case 'S':
			return $this->buffer;
		default:
			$this->Error('Incorrect output destination: '.$dest);
	}
	return '';
}

protected function _loadfont($family, $style)
{
	// Standard Helvetica widths
	$cw = array(
		0=>600,1=>600,2=>600,3=>600,4=>600,5=>600,6=>600,7=>600,8=>600,9=>600,
		10=>600,11=>600,12=>600,13=>600,14=>600,15=>600,16=>600,17=>600,18=>600,19=>600,
		20=>600,21=>600,22=>600,23=>600,24=>600,25=>600,26=>600,27=>600,28=>600,29=>600,
		30=>600,31=>600,32=>278,33=>278,34=>355,35=>556,36=>556,37=>889,38=>667,39=>191,
		40=>333,41=>333,42=>389,43=>584,44=>278,45=>333,46=>278,47=>278,48=>556,49=>556,
		50=>556,51=>556,52=>556,53=>556,54=>556,55=>556,56=>556,57=>556,58=>278,59=>278,
		60=>584,61=>584,62=>584,63=>556,64=>1015,65=>667,66=>667,67=>722,68=>722,69=>667,
		70=>611,71=>778,72=>722,73=>278,74=>500,75=>667,76=>556,77=>833,78=>722,79=>778,
		80=>667,81=>778,82=>722,83=>667,84=>611,85=>722,86=>667,87=>944,88=>667,89=>667,
		90=>611,91=>278,92=>278,93=>278,94=>469,95=>556,96=>333,97=>556,98=>556,99=>500,
		100=>556,101=>556,102=>278,103=>556,104=>556,105=>222,106=>222,107=>500,108=>222,
		109=>833,110=>556,111=>556,112=>556,113=>556,114=>333,115=>500,116=>278,117=>556,
		118=>500,119=>722,120=>500,121=>500,122=>500,123=>334,124=>260,125=>334,126=>584
	);
	$cw_char = array();
	foreach($cw as $code => $width) {
		$cw_char[chr($code)] = $width;
	}
	$fontkey = $family.$style;
	$i = count($this->fonts)+1;
	$name = 'Helvetica';
	if($style=='B') $name = 'Helvetica-Bold';
	if($style=='I') $name = 'Helvetica-Oblique';
	if($style=='BI') $name = 'Helvetica-BoldOblique';
	$this->fonts[$fontkey] = array('i'=>$i, 'type'=>'core', 'name'=>$name, 'up'=>-100, 'ut'=>50, 'cw'=>$cw_char);
}

protected function _dochecks()
{
	if(sprintf('%.1F',1.0)!='1.0')
		$this->Error('System locale prevents correct float formatting.');
}

protected function _getpagesize($size)
{
	if(is_string($size))
	{
		$size = strtolower($size);
		if(!isset($this->StdPageSizes[$size]))
			$this->Error('Unknown page size: '.$size);
		$a = $this->StdPageSizes[$size];
		return array($a[0]/$this->k, $a[1]/$this->k);
	}
	else
	{
		if($size[0]>$size[1])
			return array($size[1], $size[0]);
		else
			return $size;
	}
}

protected function _beginpage($orientation, $size, $rotation)
{
	$this->page++;
	$this->pages[$this->page] = '';
	$this->state = 2;
	$this->x = $this->lMargin;
	$this->y = $this->tMargin;
	$this->FontFamily = '';

	if($orientation=='')
		$orientation = $this->DefOrientation;
	else
		$orientation = strtoupper($orientation[0]);
	if($size=='')
		$size = $this->DefPageSize;
	else
		$size = $this->_getpagesize($size);
	if($orientation!=$this->CurOrientation || $size[0]!=$this->CurPageSize[0] || $size[1]!=$this->CurPageSize[1])
	{
		if($orientation=='P')
		{
			$this->wPt = $size[0]*$this->k;
			$this->hPt = $size[1]*$this->k;
		}
		else
		{
			$this->wPt = $size[1]*$this->k;
			$this->hPt = $size[0]*$this->k;
		}
		$this->w = $this->wPt/$this->k;
		$this->h = $this->hPt/$this->k;
		$this->CurOrientation = $orientation;
		$this->CurPageSize = $size;
	}
	$this->PageBreakTrigger = $this->h - $this->bMargin;
	$this->CurRotation = $rotation;
}

protected function _endpage()
{
	$this->state = 1;
}

protected function _escape($s)
{
	$s = html_entity_decode((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
	$s = str_replace(array('₹', '•', '’', '“', '”', '–', '—'), array('Rs. ', '*', "'", '"', '"', '-', '-'), $s);
	if(function_exists('iconv')) {
		$converted = @iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $s);
		if ($converted !== false) {
			$s = $converted;
		}
	} else if(function_exists('mb_convert_encoding')) {
		$s = mb_convert_encoding($s, 'ISO-8859-1', 'UTF-8');
	}
	$s = str_replace('\\','\\\\',$s);
	$s = str_replace('(','\\(',$s);
	$s = str_replace(')','\\)',$s);
	$s = str_replace("\r",'\\r',$s);
	return $s;
}

protected function _pageobj()
{
	// Do nothing on AddPage; pages are created sequentially during _putpages()
}

protected function _enddoc()
{
	$this->_putheader();
	$this->_putpages();
	$this->_putresources();
	$this->_putinfo();
	$this->_putcatalog();

	$offset = strlen($this->buffer);
	$this->_out('xref');
	$this->_out('0 '.($this->n+1));
	$this->_out('0000000000 65535 f  ');
	for($i=1;$i<=$this->n;$i++)
		$this->_out(sprintf('%010d 00000 n  ', $this->offsets[$i]));

	$this->_out('trailer');
	$this->_out('<</Size '.($this->n+1));
	$this->_out('/Root '.$this->n.' 0 R');
	$this->_out('/Info '.($this->n-1).' 0 R>>');
	$this->_out('startxref');
	$this->_out($offset);
	$this->_out('%%EOF');
	$this->state = 3;
}

protected function _newobj()
{
	$this->n++;
	$this->offsets[$this->n] = strlen($this->buffer);
	$this->_out($this->n.' 0 obj');
}

protected function _putpages()
{
	$nb = $this->page;
	for($n=1;$n<=$nb;$n++)
	{
		// Page Dictionary (Object 3 + 2*(n-1))
		$this->_newobj();
		$pageObjNo = $this->n;
		$streamObjNo = $pageObjNo + 1;

		$this->_out('<</Type /Page');
		$this->_out('/Parent 1 0 R');
		$this->_out(sprintf('/MediaBox [0 0 %.2F %.2F]', $this->wPt, $this->hPt));
		$this->_out('/Resources 2 0 R');
		$this->_out('/Contents '.$streamObjNo.' 0 R>>');
		$this->_out('endobj');

		// Page Content Stream (Object 4 + 2*(n-1))
		$this->_newobj();
		$p = $this->pages[$n];
		if($this->compress)
			$p = gzcompress($p);
		$this->_out('<</Length '.strlen($p));
		if($this->compress)
			$this->_out('/Filter /FlateDecode');
		$this->_out('>>');
		$this->_out('stream');
		$this->_out($p);
		$this->_out('endstream');
		$this->_out('endobj');
	}

	// Pages root object (Object 1)
	$this->offsets[1] = strlen($this->buffer);
	$this->_out('1 0 obj');
	$this->_out('<</Type /Pages');
	$kids = '/Kids [';
	for($i=1;$i<=$nb;$i++)
		$kids .= (3 + 2*($i-1)).' 0 R ';
	$this->_out($kids.']');
	$this->_out('/Count '.$nb);
	$this->_out(sprintf('/MediaBox [0 0 %.2F %.2F]', $this->wPt, $this->hPt));
	$this->_out('>>');
	$this->_out('endobj');
}

protected function _putresources()
{
	$this->_putfonts();

	// Resource dictionary (Object 2)
	$this->offsets[2] = strlen($this->buffer);
	$this->_out('2 0 obj');
	$this->_out('<<');
	$this->_putresourcedict();
	$this->_out('>>');
	$this->_out('endobj');
}

protected function _putresourcedict()
{
	$this->_out('/ProcSet [/PDF /Text /ImageB /ImageC /I]');
	$this->_out('/Font <<');
	foreach($this->fonts as $font)
		$this->_out('/F'.$font['i'].' '.$font['n'].' 0 R');
	$this->_out('>>');
}

protected function _putfonts()
{
	foreach($this->fonts as $k => $font)
	{
		$this->fonts[$k]['n'] = $this->n+1;
		$this->_newobj();
		$this->_out('<</Type /Font');
		$this->_out('/Subtype /Type1');
		$this->_out('/BaseFont /'.$font['name']);
		$this->_out('/Encoding /WinAnsiEncoding');
		$this->_out('>>');
		$this->_out('endobj');
	}
}

protected function _putinfo()
{
	$this->_newobj(); // Info Object
	$this->_out('<<');
	$this->_out('/Producer (FPDF '.FPDF_VERSION.')');
	foreach($this->metadata as $key => $value)
	{
		if(!empty($value))
			$this->_out('/'.$key.' ('.$this->_escape($value).')');
	}
	$this->_out('/CreationDate (D:'.date('YmdHis').')');
	$this->_out('>>');
	$this->_out('endobj');
}

protected function _putcatalog()
{
	$this->_newobj();
	$this->_out('<</Type /Catalog');
	$this->_out('/Pages 1 0 R>>');
	$this->_out('endobj');
}

protected function _putheader()
{
	$this->_out('%PDF-'.$this->PDFVersion);
}

protected function _out($s)
{
	if($this->state==2)
		$this->pages[$this->page] .= $s."\n";
	else
		$this->buffer .= $s."\n";
}

protected function _checkoutput()
{
	if(PHP_SAPI!='cli')
	{
		if(headers_sent($file, $line))
			$this->Error("Some data has already been output, can't send PDF file (output started at $file:$line)");
	}
}

protected function _httpdigest($name, $isUTF8)
{
	return 'filename="'.str_replace('"','\\"', $name).'"';
}

function _dounderline($x, $y, $txt)
{
	$up = $this->CurrentFont['up'];
	$ut = $this->CurrentFont['ut'];
	$w = $this->GetStringWidth($txt)+$this->ws*substr_count($txt,' ');
	return sprintf('%.2F %.2F %.2F %.2F re f', $x*$this->k, ($this->h-($y-$up/1000*$this->FontSize))*$this->k, $w*$this->k, -$ut/1000*$this->FontSizePt);
}
}
