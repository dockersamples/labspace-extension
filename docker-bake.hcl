variable "IMAGE_TAG" {
  type    = string
  default = "latest"
}

variable "IMAGE_NAMESPACE" {
  type    = string
  default = "dockersamples"
}

function tags {
  params = [namespace, name, tag]
  result = tag == "dev" ? ["${namespace}/${name}:dev"] : ["${namespace}/${name}:latest", "${namespace}/${name}:${tag}"]
}

group "default" {
  targets = [ 
    "dd-extension",
  ]
}

target "_common" {
  dockerfile = "Dockerfile"
  
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]

  attest = [
    {
      type = "provenance"
      mode = "max"
    },
    {
      type = "sbom"
    }
  ]
}

target "dd-extension" {
  inherits = ["_common"]
  context = "./"
  tags = tags(IMAGE_NAMESPACE, "labspace-extension", IMAGE_TAG)
}
