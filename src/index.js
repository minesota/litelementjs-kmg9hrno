import { LitElement, html, css } from "lit-element";


//--------------------------------------------------------------


// valida una fecha del calendario
function isValidDate(o) {
    let year = o.year
    let month = o.month-1
    let day = o.day
    let d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true
    }
    return false
}

//--------------------------------------------------------------

export class iDateInput extends LitElement {

  static properties = {
    value: { type: String , reflect: true },
    label: { type: String , reflect:true }
  };

  static styles = css`
    * {
      font-size: 100%;
    }
    /*
    label {
      margin: 0.2em;
      text-align: right;
    }
    */
    input{
      font-family: monospace;
      border-color: transparent;
    }
  `;

  constructor() {
    super();
    this.name = this.getAttribute('name')

    this.label = this.label || '';
    this.value = this.value || ''
    this.size = this.size || 11;
  }

/*
  createRenderRoot() {
    return this; // no usar shadowRoot
  }
*/

  render() {
    return html`
      <label>${this.label}:</label>
      <input type="text" size ="${this.size}" value="${this.value}" @blur="${this.onBlur}">
    `;
  }

  // AY debe tener formato 'año de inicio|primer mes'
  // AY="2016" o AY="2016|9"
  // por defecto el primer mes es 10 (octubre)
  // Se puede añadir el año final (pero no se tiene en cuenta)
  // AY="2016-17" o  AY="2016-17|9", 
  get AY(){
    if (this.hasAttribute('AY')){
      let v = this.getAttribute('AY')
      var [a,...m]=v.split('|')
      m = parseInt(m) || 10
      let [year,...n]=a.split('-')
      year = parseInt(year)
      return {ini: year, fin: year+1, firstMonth: m}
    }
    else {
      let today = new Date()
      let year = today.getFullYear()
      return {ini: year, fin: year + 1, firstMonth: 10}
    }
  }

  onBlur(ev) {
    // valor guardado (sin espacios)
    this._value = this.value.split(' ').join('')
    // nuevo valor
    let input = ev.target
    let value = input.value
    // validar y disparar event 'change'
    if (this.validate(value)){
      input.style.borderColor = "transparent"
      this.value = value
      // informar al servidor ? ...
      // o simplemente disparar event
      if (this._value !== value.split(' ').join('')){
        //let event = new CustomEvent('change', {detail: { [this.name]: value }});
        let event = new CustomEvent('change', {detail: {[this.name]: this.date }});
        this.dispatchEvent(event);
      }
    } 
    else {// no válido: mostrar que hay error
      input.style.borderColor = "red"
    }
  }

  parse(s){
    var day, month, year;
    let xDIA=/^(\d{1,2})((?:|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic){0,1})((\d{4})){0,1}$/g;
    let MONTH={ene:1, feb:2, mar:3, abr:4, may:5, jun:6, jul:7, ago:8, sep:9, oct:10, nov:11, dic:12}
    let m=xDIA.exec(s.split(' ').join(''))
    if (m){
      day = parseInt(m[1]) || null
      month = MONTH[m[2]] || null
      year = parseInt(m[4]) || null
    }
    if (!day){throw new Error(`Error parsing: ${s} (not day)`)}
    if (!month){throw new Error(`Error parsing: ${s} (not month)`)}
    if (!year){
      if (month < this.AY.firstMonth){
        year = this.AY.fin
      }
      else {
        year = this.AY.ini
      }
    } 
    return { year: year, month: month, day: day }
  }

  validate(val){
    let value = val.split(' ').join('')
    if (value === ''){return true}
    try{
      var d = this.parse(value)
    }
    catch{
      return false
    }
    return isValidDate(d)
  }
  
  get date(){
    if (this.value === ''){return ''}
    let d = this.parse(this.value)
    return {type: 'date', ...d}
    /*
    // se podría devolver en formato ISO
    let year = String(d.year).padStart(4,'0')
    let month = String(d.month).padStart(2,'0')
    let day = String(d.day).padStart(2,'0')
    return {type: 'date', iso:`${year}-${month}-${day}`}
    */
  }
}

customElements.define("idate-input", iDateInput);
