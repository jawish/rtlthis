!function(){
    var rtlThis = {
        version: '0.1.0',
        options: {
            classPrefix: 'rtl-',
            template: '<bdo dir="rtl" class="{{prefix}}{{code}}">$&</bdo>',
            scripts: {
                ara: {
                    name: 'Arabic',
                    regexp: /[[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]]{1}[[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]\d\s]+[[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]]{1}/g
                },
                div: {
                    name: 'Dhivehi',
                    regexp: /[\u0780-\u07BF]{1}[\u0780-\u07BF\d\s]+[\u0780-\u07BF]{1}/g,
                },
                heb: {
                    name: 'Hebrew',
                    regexp: /[\u0590-\u05FF]{1}[\u0590-\u05FF\d\s]+[\u0590-\u05FF]{1}/g
                },
                man: {
                    name: 'Mandaic',
                    regexp: /[\u0840–\u085F]{1}[\u0840–\u085F\d\s]+[\u0840–\u085F]{1}/g
                },
                men: {
                    name: 'Mende Kikakui',
                    regexp: /[\u1E800–\u1E8DF]{1}[\u1E800–\u1E8DF\d\s]+[\u1E800–\u1E8DF]{1}/g
                },
                nko: {
                    name: 'N\'Ko',
                    regexp: /[\u07C0-\u07FF]{1}[\u07C0-\u07FF\d\s]+[\u07C0-\u07FF]{1}/g
                },
                syc: {
                    name: 'Syriac',
                    regexp: /[\u0700-\u074F]{1}[\u0700-\u074F\d\s]+[\u0700-\u074F]{1}/g
                },
                tif: {
                    name: 'Tifinagh',
                    regexp: /[\u2D30-\u2D7F]{1}[\u2D30-\u2D7F\d\s]+[\u2D30-\u2D7F]{1}/g
                },
                urd: {
                    name: 'Urdu',
                    regexp: /[\u0600-\u06FF]{1}[\u0600-\u06FF\d\s]+[\u0600-\u06FF]{1}/g
                }
            }
        }
    };

    /**
     * Run rtlThis
     * 
     * @param elemOrQuery   DOM Element or Selector Query string
     * @param options       Options object
     */
    rtlThis.run = function (elemOrQuery, options) {
        // Prepare the options
        var options = extend(this.options, options);

        // Prepare the templates
        for (var code in options.scripts) {
            if (!options.scripts[code].template) {
                options.scripts[code].template = options.template;
            }

            options.scripts[code].template = options.scripts[code].template.replace(/{{.+?}}/g, function (key) {
                var value = '';

                switch (key) {
                    case '{{prefix}}':
                        value = options.classPrefix;
                        break;
                    case '{{code}}':
                        value = code;
                        break;
                    case '{{name}}':
                        value = options.scripts[code].name;
                        break;
                }

                return value;
            })
        }
        
        // RTL the target elements and return successfully applied elements
        return getElements(elemOrQuery).filter(function (node) {

            // Scan
            domWalk(node, function (node) {
                var code = rtlThis.matchScript(node, options.scripts);
                //console.log(node);
                if (code !== false) {
                    rtlThis.decorateText(node, options.scripts[code]);
                }
            });

            return true;
        }, this);

        return this;
    }

    /**
     * Detect and return the script used in the text content of the given node
     *
     * @param node              Node
     * @param scripts           Array of scripts and matching regexes
     * @return string
     */
    rtlThis.matchScript = function (node, scripts) {
        if (node.nodeType === Node.TEXT_NODE) {

            for (var code in scripts) {
                if (scripts[code].regexp.test(node.data)) {
                    return code;
                }
            }

        }

        return false;
    }

    /**
     * Decorate the RegExp matches in the given node as per a template
     *
     * @param node
     * @param script
     * @return boolean
     */
    rtlThis.decorateText = function (node, script) {
        // Wrap script as per the given template
        var html = node.textContent.replace(script.regexp, script.template);
        
        if (html) {
            // Replace the node with the new fragment
            node.parentNode.replaceChild(document.createRange().createContextualFragment(html), node);

            return true;
        }

        return false;
    }


    /**
     * Return the (list of) elements specified
     *
     * @param elemOrQuery   DOM Element or string specifying a selector query
     * @return Array
     */
    var getElements = function (elemOrQuery) {
        var elems = [];

        // Check type of argument (DOM Element or Selector Query):
        if (typeof elemOrQuery == 'object' && elemOrQuery.nodeType === Node.ELEMENT_NODE) {
            // DOM Element:
            elems.push(elemOrQuery);
        }
        else if (typeof elemOrQuery == 'string') {
            // Selector query:
            nodeList = document.querySelectorAll(elemOrQuery);

            // Convert nodelist to array
            elems = Array.prototype.slice.apply(nodeList);
        }

        return elems;
    }

    /**
     * DOM walker
     * 
     * Source: http://www.javascriptcookbook.com/article/Traversing-DOM-subtrees-with-a-recursive-walk-the-DOM-function/
     */
    var domWalk = function (node, func) {
        func(node, this);

        node = node.firstChild;
        while (node) {
            domWalk(node, func);
            node = node.nextSibling;
        }
    }

    /**
     * Create a new object, extending from two objects
     *
     * @param a             Base object
     * @param b             Second object
     * @return              Object
     */
    var extend = function (a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }

        return a;
    }

    if (typeof define === "function" && define.amd) define(rtlThis);
    else if (typeof module === "object" && module.exports) module.exports = rtlThis;
    this.rtlThis = rtlThis;
}();