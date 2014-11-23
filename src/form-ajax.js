/*global applicationJSON */
(function () {
    var getValidMethod = function (method) {
        if (method) {
            var proposedMethod = method.toUpperCase();

            if (['GET', 'POST', 'PUT', 'PATCH'].indexOf(proposedMethod) >= 0) {
                return proposedMethod;
            }
        }
        return null;
    };
    xtag.register('form-ajax', {
        extends: 'form',
        events: {
            'click:delegate(button[type=submit])': function (event) {
                var form = this.form;
                if (!form.hiddenSubmitEl) {
                    form.hiddenSubmitEl = document.createElement('input');
                    form.hiddenSubmitEl.setAttribute('type', 'hidden');
                    form.appendChild(form.hiddenSubmitEl);
                }
                form.hiddenSubmitEl.setAttribute('name', this.name);
                form.hiddenSubmitEl.setAttribute('value', this.value);
            },
            'submit': function (event) {
                event.preventDefault();
                event.stopPropagation();
                var method = getValidMethod(this.getAttribute('method'));
                if (!method) {
                    throw new Error('Invalid method!');
                }
                var action = this.getAttribute('action');
                if (!action) {
                    throw new Error('Invalid action!');
                }
                var form = this;
                if (this.getAttribute("enctype") === "application/json") {
                    applicationJSON(this, function (json) {
                        form.hiddenSubmitEl.removeAttribute("name");
                        var request = new XMLHttpRequest();
                        request.onreadystatechange = function () {
                            if (request.readyState === 4) {
                                xtag.fireEvent(form, 'submitted', {detail: {request: request, data: json}});
                            }
                        };
                        request.open(method, action, true);
                        request.setRequestHeader('Content-Type', "application/json");
                        request.send(JSON.stringify(json, null, 4));
                    });
                }

            }
        }
    });
})();