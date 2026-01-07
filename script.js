// ===========================
// State Management
// ===========================
let certificateData = {
    type: '',
    studentName: '',
    courseName: '',
    completionDate: '',
    grade: '',
    description: '',
    // Design Customization
    orgName: 'Your Organization',
    logoSrc: 'aarambha_logo.png', // Default placeholder
    layout: 'classic',
    primaryColor: '#1e40af',
    secondaryColor: '#f59e0b',
    signatory1: 'Principal',
    signatory2: 'Course Director'
};

// ===========================
// DOM Elements
// ===========================
const typeCards = document.querySelectorAll('.type-card');
const formSection = document.getElementById('formSection');
const previewSection = document.getElementById('previewSection');
const certificateForm = document.getElementById('certificateForm');
const resetBtn = document.getElementById('resetBtn');
const editBtn = document.getElementById('editBtn');
const downloadBtn = document.getElementById('downloadBtn');
const certificate = document.getElementById('certificate');
const appHeaderOrgName = document.getElementById('appHeaderOrgName'); // Assuming an element with this ID exists for the header

// ===========================
// Certificate Type Selection
// ===========================
typeCards.forEach(card => {
    card.addEventListener('click', function () {
        // Remove active class from all cards
        typeCards.forEach(c => c.classList.remove('active'));

        // Add active class to clicked card
        this.classList.add('active');

        // Store certificate type
        certificateData.type = this.dataset.type;

        // Show form section with animation
        formSection.classList.add('active');
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===========================
// Layout Selection (New UI)
// ===========================
const layoutOptions = document.querySelectorAll('.layout-card-option');
layoutOptions.forEach(option => {
    option.addEventListener('click', function () {
        // Remove active class from all
        layoutOptions.forEach(opt => opt.classList.remove('active'));
        // Add active to clicked
        this.classList.add('active');
        // Update data
        certificateData.layout = this.dataset.layout;
        saveState(); // Persist selection
        // Regenerate preview
        generateCertificate();
    });
});

// ===========================
// Dynamic Branding (White Label)
// ===========================
const orgNameInput = document.getElementById('orgName');
if (orgNameInput) {
    orgNameInput.addEventListener('input', function () {
        const name = this.value.trim() || 'Certificate Generator';
        const appLogo = document.querySelector('.logo');
        if (appLogo) appLogo.textContent = name;
        // Also update data realtime
        certificateData.orgName = name;
    });
}

// ===========================
// Form Handling
// ===========================
certificateForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    certificateData.studentName = document.getElementById('studentName').value;
    certificateData.courseName = document.getElementById('courseName').value;
    certificateData.completionDate = document.getElementById('completionDate').value;
    certificateData.grade = document.getElementById('grade').value;
    certificateData.description = document.getElementById('description').value;

    // Collect design data
    certificateData.orgName = document.getElementById('orgName').value || 'Your Organization';
    certificateData.logoSrc = document.getElementById('logoUpload').files[0] ? URL.createObjectURL(document.getElementById('logoUpload').files[0]) : 'aarambha_logo.png';
    certificateData.primaryColor = document.getElementById('primaryColor').value;
    certificateData.secondaryColor = document.getElementById('secondaryColor').value;
    certificateData.signatory1 = document.getElementById('signatory1').value;
    certificateData.signatory2 = document.getElementById('signatory2').value;

    // Generate certificate
    generateCertificate();

    // Show preview section
    previewSection.classList.add('active');
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===========================
// Real-time Color Updates
// ===========================
const primaryColorInput = document.getElementById('primaryColor');
const secondaryColorInput = document.getElementById('secondaryColor');

if (primaryColorInput) {
    primaryColorInput.addEventListener('input', function () {
        certificateData.primaryColor = this.value;
        updateCertificateColors();
        saveState();
    });
}

if (secondaryColorInput) {
    secondaryColorInput.addEventListener('input', function () {
        certificateData.secondaryColor = this.value;
        updateCertificateColors();
        saveState();
    });
}

// Update CSS custom properties for colors
function updateCertificateColors() {
    const certificate = document.getElementById('certificate');
    if (certificate) {
        certificate.style.setProperty('--cert-primary', certificateData.primaryColor);
        certificate.style.setProperty('--cert-secondary', certificateData.secondaryColor);
    }
}

// Reset Button
resetBtn.addEventListener('click', function () {
    certificateForm.reset();
    certificateData = {
        type: certificateData.type,
        studentName: '',
        courseName: '',
        completionDate: '',
        grade: '',
        description: '',
        orgName: 'Your Organization',
        logoSrc: 'aarambha_logo.png',
        layout: 'classic',
        primaryColor: '#1e40af',
        secondaryColor: '#f59e0b',
        signatory1: 'Principal',
        signatory2: 'Course Director'
    };

    // Reset app header (Dynamic)
    const appLogo = document.querySelector('.logo');
    if (appLogo) {
        appLogo.textContent = 'Certificate Generator';
    }
});

// Logo Upload Handling with FileReader
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');

if (logoUpload) {
    logoUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                certificateData.logoSrc = event.target.result;

                // Update preview
                if (logoPreview) {
                    logoPreview.src = event.target.result;
                    logoPreview.classList.remove('hidden');
                }
                saveState(); // Persist Logo
            };
            reader.readAsDataURL(file);
        }
    });
}

// Edit Button
editBtn.addEventListener('click', function () {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Download Button - Simple Print Solution
downloadBtn.addEventListener('click', function () {
    const certificateElement = document.getElementById('certificate');

    if (!certificateElement) {
        alert('Please generate a certificate first.');
        return;
    }

    // Simply open print dialog - works perfectly for local files
    // User can save as PDF from print dialog
    window.print();
});

// PNG Download Button - High Quality 4K
const downloadPngBtn = document.getElementById('downloadPngBtn');
downloadPngBtn.addEventListener('click', async function () {
    const certificateElement = document.getElementById('certificate');

    if (!certificateElement) {
        alert('Please generate a certificate first.');
        return;
    }

    // Show loading state
    const originalText = this.textContent;
    this.textContent = 'Generating 4K PNG...';
    this.disabled = true;

    try {
        // Step 1: Convert all images to base64 to avoid tainted canvas
        const images = certificateElement.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => convertImageToBase64(img));
        await Promise.all(imagePromises);

        // Small delay to ensure images are loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Step 2: Capture certificate at very high resolution (5x for 4K quality)
        const canvas = await html2canvas(certificateElement, {
            scale: 5, // 5x scale for ultra high quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: certificateElement.offsetWidth,
            height: certificateElement.offsetHeight,
            imageTimeout: 0
        });

        // Step 3: Convert to PNG and download
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `certificate - ${certificateData.studentName.replace(/\s+/g, '-').toLowerCase()} -4K - ${Date.now()}.png`;
            link.download = filename;
            link.href = url;
            link.click();

            // Clean up
            URL.revokeObjectURL(url);

            // Reset button
            downloadPngBtn.textContent = originalText;
            downloadPngBtn.disabled = false;
        }, 'image/png', 1.0);

    } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Failed to generate PNG. Error: ' + error.message);

        // Reset button
        this.textContent = originalText;
        this.disabled = false;
    }
});

// Helper function to convert image to base64
async function convertImageToBase64(imgElement) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Create a new image to load
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                try {
                    const dataURL = canvas.toDataURL('image/png');
                    imgElement.src = dataURL;
                    resolve();
                } catch (e) {
                    // If conversion fails, just keep original - might still work
                    console.warn('Could not convert image to base64:', imgElement.src);
                    resolve();
                }
            };

            img.onerror = function () {
                // If loading fails, keep original
                console.warn('Could not load image for conversion:', imgElement.src);
                resolve();
            };

            // Load the image
            img.src = imgElement.src;
        } catch (e) {
            console.error('Error in convertImageToBase64:', e);
            resolve(); // Resolve anyway to not block the process
        }
    });
}

// ===========================
// Certificate Generation
// ===========================
function generateCertificate() {
    const typeTexts = {
        completion: {
            title: 'Certificate of Completion',
            subtitle: 'This is to certify that',
            text: 'has successfully completed the course',
            description: 'This certificate is awarded in recognition of dedication, hard work, and successful completion of all course requirements. The recipient has demonstrated commitment to excellence and mastery of the subject matter.'
        },
        achievement: {
            title: 'Certificate of Achievement',
            subtitle: 'This is proudly presented to',
            text: 'for outstanding achievement in',
            description: 'This certificate recognizes exceptional performance, outstanding dedication, and exemplary achievement. The recipient has demonstrated excellence and has set a remarkable standard of success.'
        },
        participation: {
            title: 'Certificate of Participation',
            subtitle: 'This is awarded to',
            text: 'for active participation in',
            description: 'This certificate acknowledges active involvement, enthusiastic participation, and valuable contribution. The recipient has demonstrated commitment and has made meaningful contributions throughout the program.'
        },
        appreciation: {
            title: 'Certificate of Appreciation',
            subtitle: 'This is presented to',
            text: 'in recognition of valuable contributions to',
            description: 'This certificate is presented in appreciation of outstanding service, dedication, and valuable contributions. The recipient has demonstrated exceptional commitment and has made a significant positive impact.'
        }
    };

    const selectedType = typeTexts[certificateData.type] || typeTexts.completion;
    const certificate = document.getElementById('certificate');

    // Apply selected colors to certificate
    certificate.style.setProperty('--cert-primary', certificateData.primaryColor);
    certificate.style.setProperty('--cert-secondary', certificateData.secondaryColor);

    // Format date
    const dateObj = new Date(certificateData.completionDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Use auto-generated description if user didn't provide one
    const finalDescription = certificateData.description || selectedType.description;

    // UPDATE LAYOUT CLASSES
    // Remove all existing layout classes
    certificate.classList.remove('layout-classic', 'layout-modern', 'layout-minimal', 'layout-elegant', 'layout-banner');

    // Add new layout class (if not classic, which is default)
    if (certificateData.layout && certificateData.layout !== 'classic') {
        certificate.classList.add(`layout-${certificateData.layout}`);
    }

    // Build certificate HTML with new design
    let certificateHTML = `

        <div class="certificate-corner-tl"></div>
        <div class="certificate-corner-tr"></div>
        <div class="certificate-corner-bl"></div>
        <div class="certificate-corner-br"></div>
        
        <!--Inner Border-- >
        <div class="certificate-inner-border"></div>
        
        <!--Watermark(Dynamic) -->
        <div class="certificate-watermark">
            <img src="${certificateData.logoSrc}" alt="Watermark">
        </div>
        
        <div class="certificate-content">
            <!-- Logo -->
            <img src="${certificateData.logoSrc}" alt="${certificateData.orgName} Logo" class="certificate-logo-img">
            
            <div class="certificate-header">
                <div class="certificate-main-title">CERTIFICATE</div>
                <div class="certificate-type">OF ${selectedType.title.replace('Certificate of ', '')}</div>
                
                <!-- Diamond Decorations -->
                <div class="certificate-diamonds">
                    <div class="diamond gold"></div>
                    <div class="diamond blue"></div>
                    <div class="diamond gold"></div>
                </div>
                
                <div class="certificate-subtitle">${selectedType.subtitle}</div>
            </div>
            
            <div class="certificate-body">
                <div class="certificate-name">${certificateData.studentName}</div>
                
                <div class="certificate-description">${finalDescription}</div>
    `;

    // Add course name if provided
    if (certificateData.courseName) {
        certificateHTML += `<div class="certificate-course">${certificateData.courseName}</div>`;
    }

    // Add grade if provided
    if (certificateData.grade) {
        certificateHTML += `<div class="certificate-grade">Grade: ${certificateData.grade}</div>`;
    }

    certificateHTML += `
            </div>
            
            <div class="certificate-footer">
                <div class="certificate-signature">
                    <div class="signature-line"></div>
                    <div class="signature-title">${certificateData.signatory1}</div>
                    <div class="signature-label">Signature</div>
                </div>
                <div class="certificate-signature">
                    <div class="signature-line"></div>
                    <div class="signature-title">${certificateData.signatory2}</div>
                    <div class="signature-label">Signature</div>
                </div>
            </div>
        </div>
`;

    // Insert into certificate container
    certificate.innerHTML = certificateHTML;
}

// ===========================
// Additional Features
// ===========================

// Auto-format student name (capitalize first letter of each word)
document.getElementById('studentName').addEventListener('blur', function () {
    this.value = this.value.replace(/\b\w/g, char => char.toUpperCase());
});

// Set max date to today
document.getElementById('completionDate').setAttribute('max', new Date().toISOString().split('T')[0]);

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add loading animation when generating certificate
function showLoadingAnimation() {
    certificate.innerHTML = '<div style="text-align: center; padding: 100px; color: #64748b;">Generating certificate...</div>';
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + P to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'p' && previewSection.classList.contains('active')) {
        e.preventDefault();
        window.print();
    }

    // Escape to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===========================
// Print Optimization
// ===========================
window.addEventListener('beforeprint', function () {
    // Ensure certificate is visible before printing
    if (!previewSection.classList.contains('active')) {
        alert('Please generate a certificate before printing.');
        return false;
    }
});

// ===========================
// Persistence & Defaults
// ===========================

// Save state to local storage
function saveState() {
    const state = {
        orgName: certificateData.orgName,
        primaryColor: certificateData.primaryColor,
        secondaryColor: certificateData.secondaryColor,
        signatory1: certificateData.signatory1,
        signatory2: certificateData.signatory2,
        logoSrc: certificateData.logoSrc,
        layout: certificateData.layout
    };
    localStorage.setItem('certificateGenState', JSON.stringify(state));
}

// Load state from local storage
function loadState() {
    const savedState = localStorage.getItem('certificateGenState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Update data object
        Object.assign(certificateData, parsedState);

        // Update form fields
        if (document.getElementById('orgName')) document.getElementById('orgName').value = parsedState.orgName || 'Your Organization';
        if (document.getElementById('primaryColor')) document.getElementById('primaryColor').value = parsedState.primaryColor || '#1e40af';
        if (document.getElementById('secondaryColor')) document.getElementById('secondaryColor').value = parsedState.secondaryColor || '#f59e0b';
        if (document.getElementById('signatory1')) document.getElementById('signatory1').value = parsedState.signatory1 || 'Principal';
        if (document.getElementById('signatory2')) document.getElementById('signatory2').value = parsedState.signatory2 || 'Course Director';

        // Update Layout UI
        const layoutOptions = document.querySelectorAll('.layout-card-option');
        layoutOptions.forEach(opt => {
            if (opt.dataset.layout === parsedState.layout) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        // Update Logo Preview if restored
        if (parsedState.logoSrc && parsedState.logoSrc !== 'aarambha_logo.png') {
            const logoPreview = document.getElementById('logoPreview');
            if (logoPreview) {
                logoPreview.src = parsedState.logoSrc;
                logoPreview.classList.remove('hidden');
            }
        }

        // Update Header
        const appLogo = document.querySelector('.logo');
        if (appLogo) appLogo.textContent = parsedState.orgName || 'Certificate Generator';
    }

    // Set Dynamic Defaults (Always Fresh)
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('completionDate')) document.getElementById('completionDate').value = today;
    if (document.getElementById('studentName') && !document.getElementById('studentName').value) document.getElementById('studentName').value = "Ajaya Dhungana";
    if (document.getElementById('courseName') && !document.getElementById('courseName').value) document.getElementById('courseName').value = "Advanced Certification Course";
}

// Add Auto-Save Listeners
const autosaveInputs = ['orgName', 'primaryColor', 'secondaryColor', 'signatory1', 'signatory2'];
autosaveInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            certificateData[id] = el.value;
            saveState();
        });
    }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', loadState);

// ===========================
// Initialize
// ===========================
console.log('Certificate Generator initialized successfully!');
console.log('✨ Ready to create beautiful certificates!');

