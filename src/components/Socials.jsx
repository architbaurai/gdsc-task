export default function Socials({link, msg}){

    const fb_link = `https://www.facebook.com/share.php?u=${link}&text=${msg}`;
    const tw_link = `https://twitter.com/share?&url=${link}&text=${msg}`;
    const rd_link = `https://www.reddit.com/submit?url=${link}&title=${msg}`;
    const wa_link = `https://wa.me/?text=${msg}${link}`;
  
    return <div className="soc">
  
      <a href={fb_link} className="facebook" target ="blank"><i className="fab fa-facebook"></i></a>
      <a href={tw_link} className="twitter" target ="blank"><i className="fab fa-twitter"></i></a>
      <a href={rd_link} className="reddit" target ="blank"><i className="fab fa-reddit"></i></a>
      <a href={wa_link} className="whatsapp" target ="blank"><div className="fab fa-whatsapp"></div></a>
    </div>
  }