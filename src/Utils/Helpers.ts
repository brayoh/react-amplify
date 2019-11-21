// generator function to loop through the verification code
export function* getCode(code: string) {
  let codeString: string = `${code}`;

  for (let i = 0; i < codeString.length; i++) {
    yield parseInt(codeString[i]);
  }
}
