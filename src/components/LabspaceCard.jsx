import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useDockerContext } from "../DockerContext";

export function LabspaceCard({ labspace }) {
  const { runningLabspace, startLabspace, startingLabspace, removeLabspace } =
    useDockerContext();

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{labspace.title}</Card.Title>
        <Card.Text>{labspace.description}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex align-items-center justify-content-between">
        <div>
          {labspace.author ? (
            `Created by ${labspace.author}`
          ) : (
            <em>Custom Labspace</em>
          )}
        </div>
        <div>
          {!labspace.catalog && (
            <Button
              className="me-2"
              variant="danger"
              onClick={() => removeLabspace(labspace.publishedRepo)}
            >
              Remove
            </Button>
          )}
          <Button
            onClick={() => startLabspace(labspace.publishedRepo)}
            disabled={startingLabspace || runningLabspace}
          >
            {startingLabspace ? "Starting..." : "Launch"}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
