import React, { useState } from "react";
import Script from 'next/script';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { FileUploader } from "react-drag-drop-files";
import Tesseract from 'tesseract.js';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import Select from 'react-select';
import languages from './../languages.json';
import { FacebookIcon, FacebookShareButton, InstagramIcon, InstapaperShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, WhatsappIcon, WhatsappShareButton } from "next-share";

const fileTypes = ["bmp", "jpg", "png", "pbm", "webp"];
const siteUrl = "https://fastocr.net";
export default function Home() {
  const {
    handleFileDrop,
    imgSrc,
    ocrTextResponse,
    handleDownloadTxt,
    handleDownloadDocx,
    setSelectedLanguage,
    selectedlanguage,
  } = useHome();
  return (
    <div className={styles.container}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-LKK8XKV9XD" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LKK8XKV9XD');
        `}
      </Script>
      <Head>
        <title>FastOCR - Convert Unlimited Images To Text For Free</title>
        <meta 
        name="description" 
        content="Effortlessly convert images to editable text with our online tool." 
        key="desc"/>
        <meta 
        property="og:title" 
        content="FastOCR - Convert Unlimited Images To Text For Free" />
        <meta
        property="og:description"
        content="Effortlessly convert images to editable text with our online tool."
        />
        <meta
          property="og:image"
          content="https://fastocr.net/favicon-32x32.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Welcome to <a href="https://fastocr.net">FastOCR.net!</a>
        </h1>

        <p className={styles.description}>
          Quickly extract text from the image for free!
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>1. Upload an image</h3>
            <Select 
            value={selectedlanguage}
            onChange={(newValue) => setSelectedLanguage(newValue)}
            isMulti={false}
            placeholder={'Select language'}
            options={languages}/>
            <div style={{margin: '1rem 0'}}>
              <FileUploader 
              handleChange={handleFileDrop} 
              name="file" 
              multiple={false}
              accept="image/*"
              types={fileTypes} />
            </div>
            {imgSrc && <img 
            src={imgSrc} 
            alt="Uploaded" 
            width="100%"
            height={"auto"}/>}
          </div>               
          <div className={styles.card}>
            <div style={{
              marginBottom: '3rem'
            }}>
              <h3>2. Download the text</h3>
              {ocrTextResponse.status === 'pending' &&
              <p>Conversion in progress, please wait</p>}
              {ocrTextResponse.status === 'resolved' &&
              <>
                <button 
                className={styles.button}
                onClick={handleDownloadTxt}>Download .txt file</button>
                {/* <button onClick={handleDownloadDocx}>Download .docx</button> */}
              </>}
            </div>
            <div>
              If you like fastOcr.net, please share about us on:
              <ul className={styles.shareBtnList}>
                <li>
                  <FacebookShareButton
                  url={siteUrl}
                  >
                    <FacebookIcon />
                  </FacebookShareButton>
                </li>
                <li>
                  <LinkedinShareButton
                  url={siteUrl}
                  >
                    <LinkedinIcon />
                  </LinkedinShareButton>
                </li>
                <li>
                  <InstapaperShareButton
                  url={siteUrl}
                  >
                    <InstagramIcon />
                  </InstapaperShareButton>
                </li>
                <li>
                  <TelegramShareButton
                  url={siteUrl}
                  >
                    <TelegramIcon />
                  </TelegramShareButton>
                </li>
                <li>
                  <WhatsappShareButton
                  url={siteUrl}
                  >
                    <WhatsappIcon />
                  </WhatsappShareButton>
                </li>
              </ul>

            </div>
          </div>          
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
const useHome = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [selectedlanguage, setSelectedLanguage] = useState(
    {"value": "eng",	"label": "English"	},
  );
  const [ocrTextResponse, setOcrTextResponse] = useState({
    data: null,
    status: 'idle',
  });

  const handleFileDrop = async (file) => {
    try {
      setOcrTextResponse({
        data: null,
        status: 'pending'
      });
      setImgSrc(URL.createObjectURL(file));
      const { data: { text } } = await Tesseract.recognize(
        file,
        selectedlanguage.value, // Language code, e.g., 'eng' for English
        { logger: (info) => console.log(info) } // Optional logger configuration
      );
      setOcrTextResponse({
        data: text,
        status: 'resolved'
      });
    } catch (err) {
      setOcrTextResponse({
        data: null,
        status: 'rejected'
      });
    }
  };

  const handleDownloadTxt = () => {
    if(ocrTextResponse.status === 'resolved') {
      const blob = new Blob([ocrTextResponse.data], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'ocr_result.txt');
    };
  };

  const handleDownloadDocx = async () => {
    // const options = {
    //   styleMap: [
    //     "p[style-name='Block Text'] => p:fresh",
    //     "p[style-name='List Bullet'] => ul > li",
    //     "p[style-name='List Number'] => ol > li",
    //   ],
    // };

    // const { value } = await mammoth.extractRawText();

    // const blob = new Blob([ocrTextResponse.data], { type: 'application/msword' });
    // saveAs(blob, 'ocr_result.docx');
  };

  return {
    handleFileDrop,
    imgSrc,
    ocrTextResponse,
    handleDownloadTxt,
    handleDownloadDocx,
    selectedlanguage,
    setSelectedLanguage
  };
}; 