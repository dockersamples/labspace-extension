import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useDockerContext } from "../DockerContext";
import { useCatalogs } from "../CatalogContext";

export function LabspaceCard({ labspace }) {
  const { runningLabspace, startLabspace, startingLabspace } =
    useDockerContext();
  const { removeCustomLabspace } = useCatalogs();

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
          {labspace.catalog.url === "custom" && (
            <Button
              className="me-2"
              variant="danger"
              onClick={() => removeCustomLabspace(labspace.publishedRepo)}
            >
              Remove
            </Button>
          )}
          <Button
            onClick={() => startLabspace(labspace.publishedRepo)}
            disabled={startingLabspace || runningLabspace}
          >
            {startingLabspace === labspace.publishedRepo
              ? "Starting..."
              : "Launch"}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
