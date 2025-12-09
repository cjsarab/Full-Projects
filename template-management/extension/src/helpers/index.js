import html2pdf from 'html2pdf.js';

const getTemplateName = (template) => {
    if (template.__templateDetails) {
        return template.__templateDetails[0].xstmtmplTemplateTitle
    } else if (template.__selectedTemplateTitle) {
        return template.__selectedTemplateTitle
    }
}

export const handlePdfGeneration = async (html, template) => {
    const element = document.createElement('div');
    element.innerHTML = html;
    document.body.appendChild(element);

    const opt = {
        margin: 8,
    };

    return html2pdf()
        .from(element)
        .set(opt)
        .save(`${getTemplateName(template)}.pdf`)
        .then(() => {
            document.body.removeChild(element);
        });
};
