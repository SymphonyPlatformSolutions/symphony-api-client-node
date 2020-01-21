// array of the regular expressions used to identify tokens
const REGEX_REDACT = [/[A-Za-z0-9-_=]{20,}\.[A-Za-z0-9-_=]{20,}\.[A-Za-z0-9-_.{16,}/=]*/,
  /[A-Za-z0-9-_=]{100,}/];
const NB_ASTERIX = 20;


//Replace session token by * in the string str
function redact (strRedact) {
  if (strRedact) {
    const redactForRegExp = (str, re) => {
      let matches = str.match(re);
      if (matches) {
        matches.forEach(match => {
          let nbAsterix = (match.length) > NB_ASTERIX ? NB_ASTERIX : match.length;
          str = str.replace(match, '*'.repeat(nbAsterix));
        })
      }
      return str;
    };
    REGEX_REDACT.forEach(re => {
      strRedact = redactForRegExp(strRedact, re);
    })
  }
  return strRedact;
}

module.exports = redact;
