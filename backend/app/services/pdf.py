from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_prescription_pdf(prescription, doctor, patient, user_doctor, user_patient) -> BytesIO:
    buffer = BytesIO()
    
    # Create the document template
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#0f172a") # Deep slate
    secondary_color = colors.HexColor("#0284c7") # Ocean Blue
    text_color = colors.HexColor("#334155")
    divider_color = colors.HexColor("#cbd5e1")
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=secondary_color,
        spaceAfter=15
    )
    
    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=15,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color
    )
    
    body_bold = ParagraphStyle(
        'DocBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    # --- 1. Branding Header ---
    story.append(Paragraph("Medicore Healthcare Network", title_style))
    story.append(Paragraph("401 Maker Chambers, Nariman Point, Mumbai, MH 400021 | +91 (022) 555-0100 | contact@medicore.co.in", body_style))
    story.append(Spacer(1, 10))
    
    # Draw simple visual divider line
    d_table = Table([[""]], colWidths=[530], rowHeights=[2])
    d_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), secondary_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(d_table)
    story.append(Spacer(1, 15))

    # --- 2. Information Blocks Grid ---
    info_data = [
        [
            Paragraph("<b>DOCTOR DETAILS:</b>", body_bold),
            Paragraph("<b>PATIENT DETAILS:</b>", body_bold)
        ],
        [
            Paragraph(f"Dr. {user_doctor.first_name} {user_doctor.last_name}", body_style),
            Paragraph(f"{user_patient.first_name} {user_patient.last_name}", body_style)
        ],
        [
            Paragraph(f"Specialty: {doctor.specialty}", body_style),
            Paragraph(f"D.O.B: {patient.date_of_birth}", body_style)
        ],
        [
            Paragraph(f"License No: {doctor.license_number}", body_style),
            Paragraph(f"Blood Group: {patient.blood_group}", body_style)
        ],
        [
            Paragraph(f"Date: {prescription.issue_date.strftime('%B %d, %Y')}", body_style),
            Paragraph(f"Address: {patient.address or 'N/A'}", body_style)
        ]
    ]
    
    info_table = Table(info_data, colWidths=[265, 265])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 20))

    # --- 3. Rx Symbol & Table Header ---
    story.append(Paragraph("Rx (Prescribed Medications)", h2_style))
    
    # Table of Medicines
    med_headers = [
        Paragraph("<b>Medication Name</b>", body_bold),
        Paragraph("<b>Dosage</b>", body_bold),
        Paragraph("<b>Frequency</b>", body_bold),
        Paragraph("<b>Duration</b>", body_bold)
    ]
    
    med_rows = [med_headers]
    for med in prescription.medicines:
        med_rows.append([
            Paragraph(med.get("name", ""), body_style),
            Paragraph(med.get("dosage", ""), body_style),
            Paragraph(med.get("frequency", ""), body_style),
            Paragraph(med.get("duration", ""), body_style)
        ])
        
    med_table = Table(med_rows, colWidths=[180, 90, 160, 100])
    med_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, divider_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(med_table)
    story.append(Spacer(1, 20))

    # --- 4. Clinical Notes ---
    if prescription.notes:
        story.append(Paragraph("Clinical Advice & Lifestyle Instructions", h2_style))
        story.append(Paragraph(prescription.notes, body_style))
        story.append(Spacer(1, 25))

    # --- 5. Signature Area ---
    story.append(Spacer(1, 10))
    sig_data = [
        ["", Paragraph("_______________________________", body_bold)],
        ["", Paragraph(f"Dr. {user_doctor.first_name} {user_doctor.last_name}<br/>Digitally Signed Key Auth", body_style)]
    ]
    sig_table = Table(sig_data, colWidths=[320, 210])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sig_table)
    
    # Build Document
    doc.build(story)
    
    buffer.seek(0)
    return buffer
