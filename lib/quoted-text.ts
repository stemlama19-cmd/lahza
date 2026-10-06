// Split for presentation only. Joining the parts always preserves the supplied text verbatim.
export function quotedParts(text:string){
 return text.split(/(«[^»]*»|﴿[^﴾]*﴾|“[^”]*”|"[^"\n]*")/g).filter(Boolean).map(part=>({text:part,quoted:/^(?:«[^»]*»|﴿[^﴾]*﴾|“[^”]*”|"[^"\n]*")$/.test(part)}));
}
