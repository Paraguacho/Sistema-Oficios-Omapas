import DocumentTray from '../components/DocumentTray';

const Inbox = () => {
  return <DocumentTray fetchPath="/oficios/inbox" trayType="inbox" />;
};

export default Inbox;