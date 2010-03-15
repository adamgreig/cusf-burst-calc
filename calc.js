function get_value(id) {
    return parseFloat(document.getElementById(id).value);
}

function clear_errors() {
    var ids = ['mp', 'tar', 'tba', 'rho_g', 'rho_a', 'adm', 'bd', 'cd', 'bd_c', 'cd_c'];
    for(var i in ids) {
        document.getElementById(ids[i]).style.backgroundColor = '';
    }

    var ids = ['mp_w', 'mb_w', 'tar_w', 'tba_w'];
    for(i in ids) {
        document.getElementById(ids[i]).innerHTML = '&nbsp;';
    }
}

function show_error(id) {
    document.getElementById(id).style.backgroundColor = '#f99';
}

function set_error(id, error) {
    show_error(id);
    document.getElementById(id+"_w").innerHTML = error;
}

function sanity_check_inputs(mb, mp, tar, tba, tar_set, tba_set) {
    if(tar_set && tba_set) {
        set_error('tar', "Can't specify both!");
        set_error('tba', "Can't specify both!");
        return 1;
    } else if(!tar_set && !tba_set) {
        set_error('tar', "Must specify at least one!");
        set_error('tba', "Must specify at least one!");
        return 1;
    }

    if(tar_set && tar < 0) {
        set_error('tar', "Target ascent rate can't be negative!");
        return 1;
    } else if(tar_set && tar > 10) {
        set_error('tar', "Target ascent rate is too large! (more than 10m/s)");
        return 1;
    }

    if(tba_set && tba < 10000) {
        set_error('tba', "Target burst altitude is too low! (less than 10km)");
        return 1;
    } else if(tba_set && tba > 40000) {
        set_error('tba', "Target burst altitude is too high! (greater than 40km)");
        return 1;
    }

    if(mp < 20) {
        set_error('mp', "Mass is too small! (less than 20g)");
        return 1;
    } else if(mp > 5000) {
        set_error('mp', "Mass is too large! (over 5kg)");
        return 1;
    }

    return 0;

}

function sanity_check_constants(rho_g, rho_a, adm, bd, cd) {
    if(!rho_a || rho_a < 0) {
        show_error('rho_a');
        return 1;
    }
    if(!rho_g || rho_g < 0 || rho_g > rho_a) {
        show_error('rho_g');
        return 1;
    }
    if(!adm || adm < 0) {
        show_error('adm');
        return 1;
    }
    if(!cd || cd < 0 || cd > 1) {
        show_error('cd');
        return 1;
    }
    if(!bd || bd < 0) {
        show_error('bd');
        return 1;
    }

    return 0;
}

function find_rho_g() {
    var gas = document.getElementById('gas').value;
    var rho_g;

    switch(gas) {
        case 'he':
            rho_g = 0.1786;
            document.getElementById('rho_g').value = rho_g;
            document.getElementById('rho_g').disabled = "disabled";
            break;
        case 'h':
            rho_g = 0.0899;
            document.getElementById('rho_g').value = rho_g;
            document.getElementById('rho_g').disabled = "disabled";
            break;
        case 'ch4':
            rho_g = 0.6672;
            document.getElementById('rho_g').value = rho_g;
            document.getElementById('rho_g').disabled = "disabled";
            break;
        default:
            document.getElementById('rho_g').disabled = "";
            rho_g = get_value('rho_g');
            break;
    }

    return rho_g;
}

function find_bd(mb) {
    var bds = new Array();

    // From Kaymont Totex Sounding Balloon Data
    bds[200] = 3.00;
    bds[300] = 3.78;
    bds[350] = 4.12;
    bds[450] = 4.72;
    bds[500] = 4.99;
    bds[600] = 6.02;
    bds[700] = 6.53;
    bds[800] = 7.00;
    bds[1000] = 7.86;
    bds[1200] = 8.63;
    bds[1500] = 9.44;
    bds[2000] = 10.54;
    bds[3000] = 13.00;
 
    var bd_c = document.getElementById('bd_c').checked;
    var bd;

    if(bd_c) {
        bd = get_value('bd');
        document.getElementById('bd').disabled = "";
    } else {
        bd = bds[mb];
        document.getElementById('bd').disabled = "disabled";
        document.getElementById('bd').value = bd;
    }

    return bd;
}

function find_cd(mb) {
    var cds = new Array();

    // From Kaymont Totex Sounding Balloon Data
    cds[200] = 0.25;
    cds[300] = 0.25;
    cds[350] = 0.25;
    cds[450] = 0.25;
    cds[500] = 0.25;
    cds[600] = 0.30;
    cds[700] = 0.30;
    cds[800] = 0.30;
    cds[1000] = 0.30;
    cds[1200] = 0.25;
    cds[1500] = 0.25;
    cds[2000] = 0.25;
    cds[3000] = 0.25;

    var cd_c = document.getElementById('cd_c').checked;
    var cd;

    if(cd_c) {
        cd = get_value('cd');
        document.getElementById('cd').disabled = "";
    } else {
        cd = cds[mb];
        document.getElementById('cd').disabled = "disabled";
        document.getElementById('cd').value = cd;
    }

    return cd;
}

function calc_update() {
    // Reset error status
    clear_errors();

    // Get input values and check them
    var mb = get_value('mb');
    var mp = get_value('mp');
    var tar = get_value('tar');
    var tba = get_value('tba');
    var tar_set = 0;
    var tba_set = 0;

    if(document.getElementById('tar').value)
        tar_set = 1;
    if(document.getElementById('tba').value)
        tba_set = 1;

    if(sanity_check_inputs(mb, mp, tar, tba, tar_set, tba_set))
        return;

    // Get constants and check them
    var rho_g = find_rho_g();
    var rho_a = get_value('rho_a');
    var adm = get_value('adm');
    var bd = find_bd(mb);
    var cd = find_cd(mb);

    if(sanity_check_constants(rho_g, rho_a, adm, bd, cd))
        return;
    
    // Do some maths


}

function calc_init() {
    var ids = ['mb', 'mp', 'tar', 'tba', 'gas', 'rho_g', 'rho_a', 'adm', 'bd', 'cd', 'bd_c', 'cd_c'];
    for(var i in ids) {
        document.getElementById(ids[i]).onchange = calc_update;
    }
}
