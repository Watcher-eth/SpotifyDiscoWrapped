import { Button, HStack, Text, Icon, Image } from "@chakra-ui/react";
import { BsTelegram } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
const MirrorSuccessActionButtons = ({ originalPost }: any) => {
  const mirrorUrl = `vercel.com}`;
  const isPost = originalPost?.__typename === "Post";
  const musicianProfile = isPost
    ? originalPost?.profile
    : originalPost?.mirrorOf?.profile;

  const shareText = `I just claimed my ${originalPost?.metadata?.name} credential! Now I can proof that im the biggest fan of 🎶✨`;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(mirrorUrl);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`${shareText}`);
    const shareUrl = `https://t.me/share/url?text=${text}&url=${encodeURIComponent(
      mirrorUrl
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <HStack alignSelf={"center"} spacing={"60px"}>
      <motion.div
        style={{ width: "100px" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          h="45px"
          alignSelf={"center"}
          borderRadius="20px"
          boxShadow={"md"}
          m="0.5rem"
          onClick={handleTelegramShare}
        >
          <HStack>
            <Icon as={BsTelegram} />
            <Text>Telegram</Text>
          </HStack>
        </Button>
      </motion.div>
      <motion.div
        style={{ width: "90px" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          h="45px"
          alignSelf={"center"}
          borderRadius="20px"
          m="0.5rem"
          boxShadow={"md"}
        >
          <HStack>
            <Icon as={FaTwitter} />
            <a
              href={`http://twitter.com/share?text=${shareText}&url=${mirrorUrl}`}
              target="_blank"
              rel="noreferrer"
              className="twitter-share-button"
              data-text="I just mirrored this post on Riff"
              data-url={`${mirrorUrl}/post/`}
              data-via="riffxyz"
              data-show-count="false"
            >
              Tweet
            </a>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charSet="utf-8"
            ></script>
          </HStack>
        </Button>
      </motion.div>
      <motion.div
        style={{}}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          h="45px"
          alignSelf={"center"}
          colorScheme={"green"}
          borderRadius="20px"
          m="0.5rem"
          boxShadow={"md"}
        >
          <HStack>
            <Image
              src="https://files.readme.io/a0959e6-lens-logo1.svg"
              height="40px"
              width="40px"
            />
            <a
              href={`https://lenster.xyz/?text=I%20just%20claimed%20my%20first%20favorite%20artist%20verifiable%20credential%20on%20Disco!&url=https://spotify-disco-wrapped.vercel.app&via=discoxyz`}
              target={"_blank"}
            >
              Share on Lens
            </a>
          </HStack>
        </Button>
      </motion.div>
      <motion.div
        style={{ marginLeft: "-28px" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          h="45px"
          alignSelf={"center"}
          borderRadius="20px"
          boxShadow={"md"}
          m="0.5rem"
          onClick={handleCopyClick}
        >
          <HStack>
            <Icon as={MdOutlineContentCopy} />
            <Text>Copy</Text>
          </HStack>
        </Button>
      </motion.div>
    </HStack>
  );
};

export default MirrorSuccessActionButtons;
