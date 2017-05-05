(function($, document) {
    function init($element) {
        var $inputList = $element.find('.js-lm-calc__input');
        var $hintList = $element.find('.js-lm-calc__hint');
        var $footList = $element.find('.js-lm-calc__foot');
        $inputList.each(function() {
            $(this).on('focus', function() {
                $hintList.hide();
                $footList.removeClass('lm-calc__disabled');
                var $col = $(this).closest('.js-lm-calc__col');
                var $hint = $col.find('.js-lm-calc__hint');
                if (!$hint.length) {
                    return;
                }
                $col.find('.js-lm-calc__foot').addClass('lm-calc__disabled');
                $hint.slideToggle('fast', function() {});
            });
        });
        $(document).on('click', function(e) {
            if (!$(e.target).hasClass('js-lm-calc__input')) {
                $hintList.hide();
                $footList.removeClass('lm-calc__disabled');
            }
        });
        $inputList.change(function() {
            $(this).val($(this).val().toString().replace(/\,/g, '.'));
            $(this).val(filter($(this).val()));
            $(this).val(numberWithCommas($(this).val()));
        });

        function filter(x) {
            return x.toString().replace(/[^\.\-0-9]/gim, '');
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }

        function calc() {
            var $advBudget = $element.find('.js-lm-calc__adv-budget');
            var $adImpDown = $element.find('.js-lm-calc__ad-imp');
            var $cpc = $element.find('.js-lm-calc__cpc');
            var $transitionsDown = $element.find('.js-lm-calc__transitions');
            var $ctr = $element.find('.js-lm-calc__ctr');
            var $leadCostDown = $element.find('.js-lm-calc__lead-cost');
            var $conv = $element.find('.js-lm-calc__conversion');
            var $requestDown = $element.find('.js-lm-calc__request');
            var $convSale = $element.find('.js-lm-calc__conv-sale');
            var $personDown = $element.find('.js-lm-calc__person');
            var $avTicket = $element.find('.js-lm-calc__av-ticket');
            var $customerValueDown = $element.find('.js-lm-calc__customer-value');
            var $profit = $element.find('.js-lm-calc__profit');
            var $netProfit = $element.find('.js-lm-calc__net-profit');
            var $roiDown = $element.find('.js-lm-calc__roi');
            var calcAdvBudget = true;
            var calcAdImpDown = false;
            var calcNetProfit = false;
            $netProfit.on('focus', function() {
                calcAdvBudget = false;
                calcAdImpDown = false;
                calcNetProfit = true;
                $(this).removeClass('lm-calc__input_has_opacity');
                $advBudget.addClass('lm-calc__input_has_opacity');
                $adImpDown.addClass('lm-calc__input_has_opacity');
            }).on('focusout', function() {
                $(this).addClass('lm-calc__input_has_opacity');
                $advBudget.removeClass('lm-calc__input_has_opacity');
            });
            $adImpDown.on('focus', function() {
                calcAdvBudget = false;
                calcAdImpDown = true;
                calcNetProfit = false;
                $(this).removeClass('lm-calc__input_has_opacity');
                $advBudget.addClass('lm-calc__input_has_opacity');
            }).on('focusout', function() {});
            $advBudget.on('focus', function() {
                calcAdvBudget = true;
                calcAdImpDown = false;
                calcNetProfit = false;
                $(this).removeClass('lm-calc__input_has_opacity');
                $adImpDown.addClass('lm-calc__input_has_opacity');
            });

            function setTransitions() {
                if (calcAdImpDown) {
                    var r = Math.round(filter($adImpDown.val()) * filter($ctr.val() / 100));
                } else {
                    var r = Math.round(filter($advBudget.val()) / filter($cpc.val()));
                }
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $transitionsDown.text(r);
                $(window).trigger('changeTransitionsDown');
            }
            $advBudget.on('change', function() {
                setTransitions();
                setLeadCostDown();
                setCustomerValueDown();
                setNetProfit();
                setRoi();
            });
            $cpc.on('change', function() {
                setTransitions();
            });

            function setAdImp() {
                var r = Math.round(filter($transitionsDown.text()) / (filter($ctr.val()) / 100));
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $adImpDown.val(r);
            }
            $ctr.on('change', function() {
                if (!calcAdImpDown) {
                    setAdImp();
                } else {
                    setTransitions();
                }
            });
            $(window).on('changeTransitionsDown', function() {
                if (!calcAdImpDown) {
                    setAdImp();
                } else {
                    setAdvBudget();
                }
                setRequestDown();
            });

            function setRequestDown() {
                var r = filter($conv.val()) / 100 * filter($transitionsDown.text());
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $requestDown.text(r);
                $(window).trigger('changeRequestDown');
            }
            $conv.on('change', function() {
                setRequestDown();
            });

            function setLeadCostDown() {
                var r = filter($advBudget.val()) / filter($requestDown.text());
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $leadCostDown.text(r);
            }
            $(window).on('changeRequestDown', function() {
                setLeadCostDown();
                setPersonDown();
            });

            function setPersonDown() {
                var r = filter($convSale.val()) / 100 * filter($requestDown.text());
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $personDown.text(r);
                $(window).trigger('changePersonDown');
            }
            $convSale.on('change', function() {
                setPersonDown();
            });

            function setCustomerValueDown() {
                var r = filter($advBudget.val()) / filter($personDown.text());
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $customerValueDown.text(r);
                $(window).trigger('changeCustomerValueDown');
            }
            $(window).on('changePersonDown', function() {
                setCustomerValueDown();
                setNetProfit();
            });

            function setNetProfit() {
                var r = filter($personDown.text()) * filter($avTicket.val()) * filter($profit.val()) / 100 - filter($advBudget.val());
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $netProfit.val(r);
                $(window).trigger('changeNetProfit');
            }
            $avTicket.on('change', function() {
                setNetProfit();
            });
            $profit.on('change', function() {
                setNetProfit();
            });

            function setRoi() {
                var r = filter($netProfit.val()) / filter($advBudget.val()) * 100;
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                var $wrap = $roiDown.closest('.js-lm-calc__roi-wrap');
                if (r < 0) {
                    $wrap.addClass('lm-calc__spec_color_red');
                } else {
                    $wrap.removeClass('lm-calc__spec_color_red');
                }
                r = numberWithCommas(r);
                $roiDown.html(r);
            }
            $(window).on('changeNetProfit', function() {
                setRoi();
            });

            function setAdvBudget() {
                if (calcAdImpDown) {
                    var r = Math.round(filter($transitionsDown.text()) * (filter($cpc.val())));
                } else {
                    var l = filter($conv.val()) / 100 * filter($convSale.val()) / 100 * filter($avTicket.val()) * filter($profit.val()) / 100;
                    var r = (filter($netProfit.val()) * filter($cpc.val())) / (l - filter($cpc.val()));
                }
                if (isNaN(r) || r === Number.POSITIVE_INFINITY || r === Number.NEGATIVE_INFINITY) {
                    r = 0;
                }
                r = Math.round(r);
                r = numberWithCommas(r);
                $advBudget.val(r);
                if (calcNetProfit) {
                    setTransitions();
                    setLeadCostDown();
                    setCustomerValueDown();
                }
            }
            $netProfit.on('change', function() {
                setAdvBudget();
            });
            $adImpDown.on('change', function() {
                var r = Math.round(filter($(this).val()));
                $(this).val(numberWithCommas(r));
                setTransitions();
            });
        }
        calc();
    }
    $(document).ready(function() {
        $('.js-lm-calc').each(function() {
            init($(this));
        });
    });
}(jQuery, document));;;
