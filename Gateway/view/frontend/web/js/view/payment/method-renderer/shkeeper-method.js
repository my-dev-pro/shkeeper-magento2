/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*browser:true*/
/*global define*/
define(
    [
        'jquery',
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/action/place-order',
        'Magento_Checkout/js/action/select-payment-method',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/totals',
        'Magento_Checkout/js/model/payment/additional-validators',
        'mage/url',
    ],
    function (
        $,
        Component,
        placeOrderAction,
        selectPaymentMethodAction,
        customer,
        checkoutData,
        quote,
        totals,
        additionalValidators,
        url) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Shkeeper_Gateway/payment/shkeeper'
            },
            getCode: function() {
                return 'shkeeper';
            },
            isActive: function () {
                return true;
            },
            context: function () {
                return this;
            },
            shkeeperCode: function() {
                $.ajax({
                    url: '/shkeeper',
                    type: 'POST',
                    success: function (response) {
                        console.log(response);
                        let html = '';
                        Object.entries(response.crypto_list).map(data => {
                            let key = data[0];
                            let value = data[1];
                            html += `<option value="` + value.name + `">` + value.display_name + `</option>`;
                        });
                        $('#currencies').html(html);
                    }
                })

                $('#currencies').on('change', function () {

                    // reset previous values
                    $('#shkeeper-qrcode').html('');
                    $('#address-info').remove();
                    $('#amount-info').remove('');

                    $.ajax({
                        url: '/shkeeper/invoice',
                        type: 'POST',
                        data: 'crypto=' + $('#currencies').val() + '&amount=' + totals.getSegment('grand_total').value + '&currency=' + quote.totals().quote_currency_code + '&quoteId=' + quote.getQuoteId(),
                        success: function (response) {
                            console.log(response)

                            $('#sh-address').append('<span id="address-info">' + response.wallet + '</span>');
                            $('#sh-amount').append('<span id="amount-info">' + response.amount + ' ' + response.display_name + '</span>');

                            // Generate QRCode to scan
                            new QRCode(document.getElementById("shkeeper-qrcode"), {
                                text: response.wallet + '?amount=' + response.amount,
                                width: 128,
                                height: 128,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });

                            $('#wallet-info').css('display', 'block');
                        }
                    })

                });

            },
            getInstructions: function() {
                return window.checkoutConfig.payment.shkeeper.instructions;
            },

            selectPaymentMethod: function() {
                selectPaymentMethodAction(this.getData());
                checkoutData.setSelectedPaymentMethod(this.item.method);
                return true;
            },

        });
    }
);
