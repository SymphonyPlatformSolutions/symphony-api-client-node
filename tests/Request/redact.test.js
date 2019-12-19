const redact = require('../../lib/Request/redact');

describe('Redact', () => {

  it('Replace sessionToken by *', async () => {
    let redactedToken = redact('[DEBUG] SymBotAuth/sessionAuthenticate/str {\"token\":\"eyJhbGciOiJSUzUxMiJ9.eyJzdW' +
        'IiOiJwc2Rldl9jb3Jpbm5la3VibGVyX2JvdCIsImlzcyI6InN5bXBob255Iiwic2Vzc2lvbklkIjoiMTFhNjU2YzlhZTA4YjMzNDZiZGZmZThmN' +
        'GY5N2Y2Y2YxYTM4MmJhMjQ5MDUyYjliNjRlZWM1YzFkNzJkNDVkNDMzMjU2ZTZhOTJlNjU3YTllODQ5NjgwMmQ2OTdmNmE1MDAwMDAxNmYxZGQ3' +
        'M2NkMTAwMDEzZmYwMDAwMDAyMTciLCJ1c2VySWQiOiIzNTE3NzUwMDE0MTIxMTkifQ.NSIphL-2qaOjiCZKUy3QxoW6lApJaXdyfwpT2jHwWANh' +
        'ORRIdwa45Wa4dCjPrU9K0DuE0Uob4xBiExmpwH9cfKhouSM52eoZrIpl1BpMv-m89tTTBGQhKEWkf27YslaZw_G_sH6wvXuUDO27v0LwO62b18i' +
        'SUCrP9lfTz1nHN_GCCMq29WbhyDzQCkivvwJH2GwrBa_WBfyQoNk2Mg5eboOeC8BesDrjy2zzZPHjQInL_qhkzFuGoYfwjrAlGTm15hhRUgeyEr' +
        '50Vn4vYEIB83hGHbobnRhZB8-HOX-WkJ1YjUpjDgtAGK-hLxbXIApaOoaOGpkJEnIXyuArG0sTzg\",\"name\":\"sessionToken\"}');
    expect(redactedToken).toEqual('[DEBUG] SymBotAuth/sessionAuthenticate/str {"token":"********************","name":"sessionToken"}');
  });

  it('Replace keyManagerToken by *', async () => {
    let redactedToken = redact('[DEBUG] SymBotAuth/kmAuthenticate/str {"token":"01000b11c94c0f3c7efbd672fea397d2cf' +
        '14e074466dcb356c9b5d6cdd7ce80ad8315095f63599928ba8a0ab69a2428793a8fdf7072af10984473ba755d8ac65e3b0c3fb6c142415' +
        'b1cb3788c59a49b6781a5504217e36da4e6295dcfb0156643ec51a7b0a3e70f8cb25a53c503fd475438c05e8bd4d330cc1ef3727306919' +
        '231ade113f93ce84b9de1cdc64cc58d2e10a6c2581e6ee89191f8200df12d5c9df873f9a9e34f993aa609899c8ac3e376ee417f7894436' +
        '0345dd","name":"keyManagerToken"}');
    expect(redactedToken).toEqual('[DEBUG] SymBotAuth/kmAuthenticate/str {"token":"********************","name":"keyManagerToken"}');
  });

  it('Do not replace email', async () => {
    let redactedToken = redact('[DEBUG] UsersClient/getUserFromIdV3/str {"users":[{"id":351775001411684,"emailAddre' +
        'ss":"cwt_api_service_user@psdev.symphony.com","displayName":"cwt_api_service_user","company":"Symphony Platform');
    expect(redactedToken).toEqual(redactedToken);
  });

  it('No exception with null value', async () => {
    let redactedToken = redact(null);
    expect(redactedToken).toEqual(null);
  })

});
