$(document).ready(function() {
    
    $('#formLogin').on('submit', function(event) {
        event.preventDefault(); 
        
        let $btn = $('#submitBtn');
        let originalText = $btn.text();
        
        $btn.text('Memproses...').prop('disabled', true).css('opacity', '0.7');
        
        setTimeout(function() {
            alert("Login berhasil! Selamat datang di Portal Edukasi Digital.");
            
            $btn.text(originalText).prop('disabled', false).css('opacity', '1');
            
            $('#formLogin')[0].reset(); 
            
        }, 1500);
    });

});