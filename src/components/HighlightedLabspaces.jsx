import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { LabspaceCard } from "./LabspaceCard";

export function HighlightedLabspaces({
  labspaces,
  activeLabspace,
  onLaunch,
  startingLabspace,
}) {
  return (
    <Row className="mb-5">
      <Col xs={12}>
        <h3>Highlighted Labspaces</h3>
      </Col>

      {labspaces.map((labspace) => (
        <Col key={labspace.title} xs={12} sm={6} md={4} className="mb-4">
          <LabspaceCard labspace={labspace} />
        </Col>
      ))}
    </Row>
  );
}
