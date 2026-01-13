import { useDockerContext } from "./DockerContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LaunchModal } from "./components/LaunchModal";
import { RunningNotice } from "./components/RunningNotice";
import { useState } from "react";
import { AddLabspaceModal } from "./components/AddLabspaceModal";
import { LaunchLabspaceFromUrlModal } from "./components/LaunchLabspaceFromUrlModal";
import { LabspaceCatalog } from "./components/Catalog/LabspaceCatalog";
import { useCatalogs } from "./CatalogContext";

export function Home() {
  const {
    hasLabspace,
    runningLabspace,
    stopLabspace,
    stoppingLabspace,
    startLabspace,
    startingLabspace,
    launchLog,
  } = useDockerContext();

  const { labspaces, addCustomLabspace } = useCatalogs();

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Container fluid className="mt-5 mb-3 pe-5">
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Labspaces</h2>
          <p className="lead">
            Interactive hands-on labs for learning and training.
          </p>
        </Col>
      </Row>

      <RunningNotice
        hasLabspace={hasLabspace}
        isRunning={!!runningLabspace}
        labspaceTitle={
          runningLabspace
            ? (runningLabspace.title)
            : ""
        }
        onRemove={stopLabspace}
        isStopping={stoppingLabspace}
      />

      <LabspaceCatalog
        labspaces={labspaces}
        onTriggerAddLabspace={() => setShowAddModal(true)}
      />

      <LaunchModal launchLog={launchLog} starting={startingLabspace} />

      <AddLabspaceModal
        show={showAddModal}
        onAdd={(title, repo) => {
          addCustomLabspace(title, repo);
          setShowAddModal(false);
        }}
        onCancel={() => setShowAddModal(false)}
      />

      <LaunchLabspaceFromUrlModal
        onLaunchConfirmation={(title, location) => {
          if (labspaces.find((l) => l.location === location) === undefined)
            addCustomLabspace(title, location);
          startLabspace(location);
        }}
      />
    </Container>
  );
}
