$(document).ready(function () {

    $(".timeConvert").each(function () {
        const dateTime = new Date($(this).data("date"));
        var time;
        if ($(this).data("sec")) {
            time = dateTime.toString("HH:mm:ss");
        } else {
            time = dateTime.toString("HH:mm");
        }
        var date = dateTime.toString("dd/MM/YYYY");
        if ($(this).data()) {

        }//
        //  $(this).text(`${time} ${date}`);
        if ($(this).data("sec")) {
            $(this).text(moment($(this).data("date")).format('DD MMM YYYY, HH:mm:ss'));
        } else {
            $(this).text(moment($(this).data("date")).format('DD MMM YYYY, HH:mm'));
        }
    });

    $(".short-link").each(function () {
        const fullLink = new URL($(this).attr("href")).hostname;
        $(this).text(fullLink);
    });

    window.onscroll = function () {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (scrollPos >= 200)
            document.getElementById("goToTop").className = "";
        else
            document.getElementById("goToTop").className = "hidden";
    };

    window.onload = function () {
        if (location.hash) {
            if (location.hash.indexOf("com")) {
                $(location.hash).addClass("active");
            }
        }
    };

    function getPlugins(type) {
        const common = `autolink image paste customEmoticons`;
        const type1 = `advlist lists link hr media textcolor colorpicker ${common}`;
        if (type === 1) {
            return type1;
        }
        if (type === 2) {
            return `code fullscreen table visualblocks ${type1}`;
        }
        if (type === 3) {
            return `${common}`;
        }
        return "";
    }

    
    function getToolbar(type) {
        const common =
            `bold italic underline strikethrough | customEmoticons`;//poiler-add spoiler-remove`;
        const type1 = `styleselect | ${common} | link image media | fontsizeselect hr
                                 | bullist numlist | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent`;
        const type2 = `undo redo | fullscreen ${type1} | table code | visualblocks`;
        if(type === 1) {
            return type1;
        }
        if (type === 2) {
            return type2;
        }
        if (type === 3) {
            return common;
        }
        return "";
    }

    function initTiny(elementId, type = 1) {
        const elemId = "#" + elementId;
        const settings1
            = {
                autoresize_overflow_padding: 0,
                selector: elemId,
                convert_urls: true,
                schema: "html5",
                fontsize_formats: "8pt 10pt 11pt 12pt 14pt 16pt",
                forced_root_block: "",
                min_height: this.height,
                browser_spellcheck: true,
                gecko_spellcheck: true,
                remove_trailing_brs: true,
                menubar: false,
                language: "ru",
                // inline: true,
                plugins: [
                     getPlugins(type)
                ],
                allow_script_urls: true,
                relative_urls: true,
                document_base_url: "/",
                toolbar: getToolbar(type),
                visualblocks_default_state: true,
                external_plugins: {
                    customEmoticons: "/plugins/customEmoticons/plugin.js"
                },
                skin_url: "/src/lightgray",
                setup: (editor) => {//Editor) => {
                    this.editor = editor;
                    editor.on("change", () => {
                        const content = editor.getContent();
                        $(elemId).html(content);
                    });
                    editor.on("keyup", () => {
                        const content = editor.getContent();
                        $(elemId).html(content);
                    });
                }
            }
        tinymce.init(settings1);
    }

    initTiny("newComment");
})

