export const cpfMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') 
}

export const cnpjMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') 
}

export const cepMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
}

export const telMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1')  
}

export const tempMask = value => {
  return value
  .replace(/\D/g, '')
  .replace(/(\d{2})(\d)/, '$1.$2') 
}

export const timerMask = value => {
  return value
  .replace(/\D/g, '')
  .replace(/(\d{2})(\d)/, '$1:$2')
  .replace(/(\d{2})\d+?$/, '$1')
}

export const dateMask = value => {
  return value
  .replace(/\D/g, '')
  .replace(/(\d{2})(\d)/, '$1/$2')
  .replace(/(\d{2})(\d)/, '$1/$2')
  .replace(/(\d{4})\d+?$/, '$1')
}

export const getDate = () => {
    var dNow = new Date();
    var localdate = dNow.getFullYear() + '-' + '0'+(+dNow.getMonth()+1) + '-' + dNow.getDate() 
    return localdate;  
}

export const moneyMask = value => {
  return value
      .replace(/\D/g, '')
      .replace(/(\d{1})(\d{14})$/,'$1.$2')
      .replace(/(\d{1})(\d{11})$/,'$1.$2')
      .replace(/(\d{1})(\d{8})$/,'$1.$2')
      .replace(/(\d{1})(\d{5})$/,'$1.$2') 
      .replace(/(\d{1})(\d{1,2})$/,'$1,$2')
}