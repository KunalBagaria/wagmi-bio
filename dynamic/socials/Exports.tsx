import Discord from './Discord';
import Facebook from './Facebook';
import GitHub from './GitHub';
import Instagram from './Instagram';
import Linkedin from './Linkedin';
import Twitter from './Twitter';
import YouTube from './YouTube';
import Tiktok from './Tiktok';
import Link from './Link';

export {
  Discord,
  Facebook,
  GitHub,
  Instagram,
  Linkedin,
  Twitter,
  YouTube,
  Tiktok,
  Link,
};

const supportedLinks = ['discord', 'facebook', 'github', 'instagram', 'linkedin', 'twitter', 'youtube', 'tiktok', 'link'];

export const GetIcon = ({
  link
}: {
  link: string
}) => {
  const parsedLink = link.split('.com')[0];
  const host = parsedLink.split('//')?.[1]?.toLowerCase();
  return (
    <>
      {host && supportedLinks.includes(host) && (
        <a href={link} rel="noopener noreferrer" target="_blank">
          {host.includes('discord') && <Discord color="#B4B7C0" />}
          {host.includes('facebook') && <Facebook color="#B4B7C0" />}
          {host.includes('github') && <GitHub color="#B4B7C0" />}
          {host.includes('instagram') && <Instagram color="#B4B7C0" />}
          {host.includes('linkedin') && <Linkedin color="#B4B7C0" />}
          {host.includes('twitter') && <Twitter color="#B4B7C0" />}
          {host.includes('youtube') && <YouTube color="#B4B7C0" />}
          {host.includes('tiktok') && <Tiktok color="#B4B7C0" />}
        </a>
      )}
      {host && !supportedLinks.includes(host) && (
        <a href={link} rel="noopener noreferrer" target="_blank">
          <Link color="#B4B7C0" />
        </a>
      )}
    </>
  );
};