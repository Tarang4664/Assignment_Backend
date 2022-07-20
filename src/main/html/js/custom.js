$(document).ready(function(){

    $("#viewProfile").hide();
    $(".err-message").hide();
    $(".update-msg").hide();

    var isClicked = false;
    $("#profileInfo").off('click').on('click touch',function(){
        isClicked = true;
        if(!$(this).hasClass('expand-menu')){
            $(this).addClass("expand-menu");
        }else{
            $(this).removeClass("expand-menu");
        }
    });

    $("body").off('click').on('click touch', function(){
        if(!isClicked){
            if($("#profileInfo").hasClass('expand-menu')){
                $("#profileInfo").removeClass("expand-menu");
            }
        }
        isClicked = false;
    });

    $("#savedCardTab").click(function(){
        $("#savedCardAccordion, #addCardButton").show();
        $("#netBankingAccordion, #othersAccordion, #addAccountButton, #withdrawButton").hide();
        $("#savedCardTab").addClass("selected");
        $("#netBankingTab, #withdrawTab").removeClass("selected");
    });

    $("#netBankingTab").click(function(){
        $("#netBankingAccordion, #addAccountButton").show();
        $("#savedCardAccordion, #othersAccordion, #addCardButton, #withdrawButton").hide();
        $("#netBankingTab").addClass("selected");
        $("#savedCardTab, #withdrawTab").removeClass("selected");
    });

    $("#withdrawTab").click(function(){
        $("#othersAccordion, #withdrawButton").show();
        $("#netBankingAccordion, #savedCardAccordion, #addCardButton, #addAccountButton").hide();
        $("#withdrawTab").addClass("selected");
        $("#savedCardTab, #netBankingTab").removeClass("selected");
    });

    $("#profile").click(function(){
        hideAll();
        $(".update-msg").hide();
		$("#viewProfile").show();
    });

	$("#editProfileBtn").click(function(){
        $(".update-msg").hide();
        $("#viewProfile").hide();
		$("#editProfile").show();
    });
	
	//Add cash to your wallet
	$("#wallet100, #wallet500, #walletCustom").click(function(){
		$(".wallet-amount li").removeClass("select-wallet");
		$(this).addClass("select-wallet");
	});
	
	$("#walletCustom").click(function(){
		$("#walletAmountList").hide();
		$("#customAmount").show();
	});
	
	//Add cash to your wallet Tabs
	$("#walletCardTab, #walletNetbankingTab, #walletOthersTab").click(function(){
		$(".from-list li").removeClass("selected");
		$(this).addClass("selected");
	});
	//Add cash to your wallet Tabs Content
	$("#walletCardTab").click(function(){
		$("#walletNetbanking, #walletOthers, #walletCardDetails, #walletNetbankingDetails").hide();
		$("#walletCard").show();
	});
	$("#walletNetbankingTab").click(function(){
		$("#walletCard, #walletOthers, #walletCardDetails, #walletNetbankingDetails").hide();
		$("#walletNetbanking").show();
	});
	$("#walletOthersTab").click(function(){
		$("#walletNetbanking, #walletCard, #walletCardDetails, #walletNetbankingDetails").hide();
		$("#walletOthers").show();
	});
	$("#firstCard").click(function(){
		$("#walletCard").hide();
		$("#walletCardDetails").show();
	});
	$("#firstNetBank").click(function(){
		$("#walletNetbanking").hide();
		$("#walletNetbankingDetails").show();
	});
	
});

function validatePhone() {
    var a = $("#userPhoneNumberInput").val();
    console.log("phone "+a)
    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    var isnum = /^\d+$/.test(a);
    if (a.length == 10 && filter.test(a)) {
        $('#spnPhoneStatus').hide();
        $('#spnPhoneStatus').html('');
        $('#spnPhoneStatus').css('color', 'green');
        return true;
    }
    else {
        $('#spnPhoneStatus').html('Please enter a valid Mobile Number.');
        $('#spnPhoneStatus').css('color', 'red');
        $('#spnPhoneStatus').show();
        return false;
    }
}

function validateUsername()
{
    var value = $("#userNameInput").val().trim();
    if (value != "") {
        $('#spnUserNameStatus').hide('');
        $('#spnUserNameStatus').html('');
        $('#spnUserNameStatus').css('color', 'green');
        return true;
    }
    else {
        $('#spnUserNameStatus').html('Please enter a valid Name.');
        $('#spnUserNameStatus').css('color', 'red');
        $('#spnUserNameStatus').show('');
        return false;
    }
}