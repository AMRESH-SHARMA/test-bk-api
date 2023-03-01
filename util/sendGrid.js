import sgMail from "@sendgrid/mail";
import { SECRETS } from "./config.js";

const key = SECRETS.sendGrid;
sgMail.setApiKey(key);

export const EmailOTP = async (data, content, subject) => {
  console.log(data);

  const msg = {
    to: data.email, // Change to your recipient
    from: SECRETS.senderEmail, // Change to your verified sender
    subject: subject,

    html: `

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>{{ email_title }}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/notifications/styles.css"
        />
        <style>
          .button__cell { background:  green , color :"white" ; }
          a, a:hover, a:active, a:visited { color:  green ; }
        </style>
      </head>
    
      <body>
        <table class="body" >
          <tr >
            <td >
              <table class="header row" > 
                <tr >
                  <td class="header__cell" >
                    <center >
                      <table class="container" > 
                        <tr >
                          <td >
                            <table class="row" >
                              <tr >
                                <td class="shop-name__cell" >
                                  <img
                                    src="https://res.cloudinary.com/dsxn6czby/image/upload/v1653126065/cbdlkjwta4ffvlp1g2uo.png"
                                    alt=" Vardhman "
                                    width="150px"
                                  />
    
                                  <h1 class="shop-name__text">
                                    <a href="https://www.vardhmanyarns.in/"
                                      > Vardhman </a
                                    >
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </center>
                  </td>
                </tr>
              </table>
    
              <table class="row content" >
                <tr >
                  <td class="content__cell" >
                    <center >
                      <table class="container" >
                        <tr >
                          <td >
                            <h2 > OTP Verification </h2>
                            <h2 >
                              Here's your OTP:
                              <span style="color: green">${content}</span>
                            </h2>
                            <p>
                               You've activated your customer account. Next time
                              you shop with us, log in for faster checkout 
                            </p>
    
                            <table class="row actions" >
                              <tr >
                                <td class="actions__cell" >
                                  <table class="button main-action-cell" >
                                    <tr >
                                      <td class="button__cell" >
                                        <a
                                          href=" https://www.vardhmanyarns.in/ "
                                          class="button__text"
                                          >Visit our store</a
                                        >
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
    
                        </tr>
                      </table>
                    </center>
    
                  </td>
                </tr>
              </table>
              <table class="row footer">
                <tr>
                  <td class="footer__cell">
                    <center>
                      <table class="container">
                        <tr>
                          <td>
                            <p class="disclaimer__subtext">
                              If you have any questions, reply to this email or
                              contact us at
                              <a href="mailto:{{ vardhmanmelange@gmail.com }}"
                                > vardhmanmelange@gmail.com  </a
                              >
                            </p>
                          </td>
                        </tr>
                      </table>
                    </center>
                  </td>
                </tr>
              </table>
    
              <img
                src="https://res.cloudinary.com/dsxn6czby/image/upload/v1653126065/cbdlkjwta4ffvlp1g2uo.png"
                class="spacer"
                width="150px"
              />
            </td>
          </tr>
        </table>
      </body>
    </html>
    `,
  };
  try {
    await sgMail.send(msg);
    console.log("Email Sent");
  } catch (err) {
    console.log(err, " THis is error in Sendgrind sgMail");
    return new Error("Cannot send Mail");
  }
};