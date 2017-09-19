/**
 * Created by Sergey Ganziy on 13.09.2017.
 */
/* global jQuery:false */
/* global Messenger:false */
(function ($) {
    $.globalMessenger({ extraClasses: 'messenger-fixed messenger-on-top messenger-on-right', theme: 'flat' });
    Messenger.options = { extraClasses: 'messenger-fixed messenger-on-top messenger-on-right', theme: 'flat' };

    function initEditor(selector, id) {
        var $selector = $(selector);
        $selector.validate({
            focusInvalid: false,
            errorElement: 'span', // default input error message container
            ignore: '',
            rules: {
                txtFirstName: {
                    required: true
                },
                txtLastName: {
                    required: true
                },
                txtEmail: {
                    email: true,
                    required: true
                }
            },

            invalidHandler: function (event, validator) {
                // display error alert on form submit
            },

            errorPlacement: function (label, element) { // render error placement for each input type
            },

            highlight: function (element) { // hightlight error inputs
                var parent = $(element).parent();
                parent.removeClass('success-control').addClass('error-control');
            },

            unhighlight: function (element) { // revert the change done by hightlight
                var parent = $(element).parent();
                parent.removeClass('error-control').addClass('success-control');
            },

            success: function (label, element) {
                var parent = $(element).parent();
                parent.removeClass('error-control').addClass('success-control');
            },

            submitHandler: function (form) {
                var postData = {
                    firstname: form.txtFirstName.value,
                    lastname: form.txtLastName.value,
                    email: form.txtEmail.value
                };
                $.ajax({
                    url: '' === id ? '/html/api/add-address' : '/html/api/update-address/' + id,
                    type: '' === id ? 'POST' : 'PUT',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    timeout: 10000,
                    data: JSON.stringify(postData),
                    beforeSend: function () {
                        $.Webarch.blockUI(form);
                    }
                }).always(function () {
                    $.Webarch.unblockUI(form);
                }).done(function (response) {
                    Messenger().post({
                        message: response.message,
                        type: response.success ? 'success' : 'error',
                        showCloseButton: true
                    });
                    if (response.success) {
                        if ('' === id) {
                            $('#new-address-wrapper').slideToggle('fast', 'linear');
                            if (0 === $('.addresslist').has('.row').length) {
                                $('.addresslist').html('');
                            }
                            $('.addresslist').prepend($(response.address));
                        } else {
                            var $grid = $selector.parents('.grid');
                            $grid.find('.grid-title .name').html(postData.firstname + ' ' + postData.lastname);
                            $grid.find('.grid-title .email')
                                .html('<a href="mailto:' + postData.email + '">' + postData.email + '</a>');
                            $selector.parents('.grid-actions').slideToggle('fast', 'linear');
                        }
                    }
                }).fail(function () {
                    Messenger().post({
                        message: '' === id ? 'Error creating new address' : 'Error updating existing address',
                        type: 'error',
                        showCloseButton: true
                    });
                });
                return false;
            }
        });
    }

    /** Events **/
    $('#btn-new-address').click(function () {
        $('#txtFirstName').val('');
        $('#txtLastName').val('');
        $('#txtEmail').val('');
        $('#new-address-wrapper').slideToggle('fast', 'linear');
    });

    $('#btn-close-address').click(function () {
        $('#new-address-wrapper').slideToggle('fast', 'linear');
    });

    $('.page-content').on('click', 'button.btn-close-editor', function () {
        $(this).parents('.grid-actions').slideToggle('fast', 'linear');
    });

    $('.page-content').on('click', '.grid .actions a.remove', function () {
        var $this = $(this);
        var removable = $this.parents('.grid');
        $.ajax({
            url: '/html/api/delete-address/' + removable.data('id'),
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            timeout: 10000,
            beforeSend: function () {
                $.Webarch.blockUI(removable);
            }
        }).always(function () {
            $.Webarch.unblockUI(removable);
        }).done(function (response) {
            Messenger().post({
                message: response.message,
                type: response.success ? 'success' : 'error',
                showCloseButton: true
            });
            if (response.success) {
                if (removable.next().hasClass('grid') || removable.prev().hasClass('grid')) {
                    $this.parents('.grid').remove();
                } else {
                    $this.parents('.grid').parent().remove();
                }
            }
        }).fail(function () {
            Messenger().post({
                message: 'Error deleting record',
                type: 'error',
                showCloseButton: true
            });
        });
        return false;
    });

    $('.page-content').on('click', '.grid .actions a.edit', function () {
        var $this = $(this);
        var el = $this.parents('.grid').children('.grid-actions');
        if (!el.hasClass('active')) {
            var $active = $('.grid').children('.grid-actions.active');
            $active.find('form.edit-address-form').removeData('validate');
            $active.removeClass('active').slideUp(200);
        }
        el.addClass('active');
        el.slideToggle(200);
        var id = $this.parents('.grid').data('id');
        var selector = 'form.edit-address-form[data-id="' + id + '"]';
        initEditor(selector, id);
        return false;
    });

    $('.page-content').on('click', '.grid .clickable', function () {
        var el = $(this).parents('.grid').children('.info');
        el.slideToggle(200);
    });
}(jQuery));
