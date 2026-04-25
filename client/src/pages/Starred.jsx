import DocumentTray from '../components/DocumentTray';

const Starred= () => {
  return <DocumentTray fetchPath="/oficios/starred" trayType="starred" />;
};

export default Starred;