class ResponseFormat {

  timeStamp:string;
  statusCode:number;
  httpStatus:string;
  message:string;
  data!: JSON;

  constructor(statusCode:number, httpStatus:string, message:string, data?:any){
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    data ? this.data = data : null;
  }
}
  
export default ResponseFormat;