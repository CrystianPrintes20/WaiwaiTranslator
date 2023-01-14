import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../src/layout/Layout";
import Banner from "../src/components/banner/Banner";
import {
  Button,
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import Banner3 from "../src/components/banner/Banner3";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useCallback } from "react";
import Dropzone from "../src/components/dragDrop";
import Image from "../src/components/PreviewImagem";

import ReactAudioPlayer from "react-audio-player";
import { getCookie, getCookies } from "cookies-next";

/**
 * Importações para entrada de áudio
 */
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

// cuid is a simple library to generate unique IDs
import cuid from "cuid";

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

export default function RegisterWords({ token }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [image, setImage] = useState(null);

  /*
   * Módulo para entrada de áudio
   */
  const [record, setRecord] = useState(null);
  const recorderControls = useAudioRecorder();

  const removeImage = () => {
    setImage(null);
  };
  const removeAudio = () => {
    setRecord(null);
  };

  const addAudioElement = (blob) => {
    setRecord(blob);
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImage({ id: cuid(), src: e.target.result, name: file.name });
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const initialValues = {
    wordPort: "",
    translationWaiwai: "",
    category: "",
    meaningPort: "",
    meaningWaiwai: "",
    synonymPort: "",
    synonymWaiwai: "",
  };

  const validationSchema = Yup.object().shape({
    wordPort: Yup.string().required("Este campo é obrigatorio."),
    translationWaiwai: Yup.string().required("Este campo é obrigatorio."),
    category: Yup.string().required("Este campo é obrigatorio."),
    meaningPort: Yup.string().required("Este campo é obrigatorio."),
    meaningWaiwai: Yup.string().required("Este campo é obrigatorio."),
    synonymPort: Yup.string().required("Este campo é obrigatorio."),
    synonymWaiwai: Yup.string().required("Este campo é obrigatorio."),
  });

  useEffect(() => {
    console.log(record);
  });

  if (session) {
    return (
      <>
        <Layout>
          <Banner3 />
          <Card className="feature4">
            <Container>
              <Row className="justify-content-center">
                <h2 className="title my-5">
                  Contribua e melhore o Wai-Wai Translator!
                </h2>
              </Row>
              <Row>
                <Col sm="4">
                  <Card>
                    <img alt="Card" src="./tradutor.jpg" />
                    <CardBody>
                      <div className="h-u-text-left main__item--card__desc">
                        <p>
                          A sua colaboração é uma parte importante no processo
                          de inclusão de novas palavras no Wai-Wai Translator.
                          Se você fala ou conhece palavras na língua nativa
                          Wai-Wai e identificou que ela ainda não está presente
                          aqui, ajude-nos preenchendo o formulário ao lado e
                          adicionando elas ao nosso tradutor.
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm="8">
                  <Card>
                    <CardBody>
                      <h4 className="mb-3 fw-bold">Cadastro de Palavras</h4>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (fields) => {
                          try {
                            setIsLoading(true);
                            const response = await axios.post(
                              "http://localhost:5000/palavras/",
                              JSON.stringify(fields),
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            const { data } = response;
                            if (image) {
                              // https://stackoverflow.com/questions/12168909/blob-from-dataurl
                              const blobData = await (
                                await fetch(image.src)
                              ).blob();
                              let uploadImage = new FormData();
                              uploadImage.append("file", blobData, image.name);
                              uploadImage.append("oidword", data._id);
                              let responseImage = await axios({
                                method: "post",
                                url: "http://localhost:5000/uploads/",
                                data: uploadImage,
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                            }
                            if (record) {
                              const event = new Date();
                              let uploadRecord = new FormData();
                              uploadRecord.append(
                                "file",
                                record,
                                `${event.toISOString()}.weba`
                              );
                              uploadRecord.append("oidword", data._id);
                              let responseRecord = await axios({
                                method: "post",
                                url: "http://localhost:5000/uploads/",
                                data: uploadRecord,
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                            }

                            if (response.status === 201) {
                              toast.success(
                                "Nova palavra adicionada com sucesso!",
                                {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: true,
                                  progress: undefined,
                                }
                              );
                              router.push("/myWord");
                            }
                          } catch (err) {
                            if (
                              err?.response.status === 409 ||
                              err?.response?.data?.message
                            ) {
                              toast.error(
                                "Palavra já cadastrada! Verifique-a e tente novamente.",
                                {
                                  position: "top-right",
                                  autoClose: 5000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: false,
                                  draggable: true,
                                  progress: undefined,
                                }
                              );
                              console.log({
                                type: "error",
                                message: err.response.data.message,
                              });
                            } else {
                              toast.error("Erro ao cadastrar.", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                              });
                              console.log({
                                type: "error",
                                message: "An error ocurred. Please, try again.",
                              });
                            }
                          }
                          setIsLoading(false);
                        }}
                        render={({ errors, touched }) => (
                          <Form>
                            <Row>
                              <FormGroup className="w-50 pr-3">
                                <Label htmlFor="wordPort">
                                  Palavra em português
                                </Label>
                                <Field
                                  name="wordPort"
                                  type="text"
                                  className={`form-control ${
                                    errors.wordPort && touched.wordPort
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="wordPort"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                              <FormGroup className="w-50">
                                <Label htmlFor="translationWaiwai">
                                  Tradução em Waiwai
                                </Label>
                                <Field
                                  name="translationWaiwai"
                                  type="text"
                                  className={`form-control ${
                                    errors.translationWaiwai &&
                                    touched.translationWaiwai
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="translationWaiwai"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Row>
                            <Row>
                              <FormGroup className="w-50 pr-3">
                                <Label htmlFor="meaningPort">
                                  Significado em português
                                </Label>
                                <Field
                                  name="meaningPort"
                                  type="textarea"
                                  rows="3"
                                  id="meaningPort"
                                  className={`form-control ${
                                    errors.meaningPort && touched.meaningPort
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                  component={MyInput}
                                />
                                <ErrorMessage
                                  name="meaningPort"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                              <FormGroup className="w-50">
                                <Label htmlFor="meaningWaiwai">
                                  Significado em Waiwai
                                </Label>
                                <Field
                                  name="meaningWaiwai"
                                  type="textarea"
                                  rows="3"
                                  className={`form-control ${
                                    errors.meaningWaiwai &&
                                    touched.meaningWaiwai
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                  component={MyInput}
                                />
                                <ErrorMessage
                                  name="meaningWaiwai"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Row>
                            <Row>
                              <FormGroup className="w-50 pr-3">
                                <Label htmlFor="synonymPort">
                                  Sinonimo em Portugues
                                </Label>
                                <Field
                                  name="synonymPort"
                                  type="text"
                                  className={`form-control ${
                                    errors.synonymPort && touched.synonymPort
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="synonymPort"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                              <FormGroup className="w-50">
                                <Label htmlFor="synonymWaiwai">
                                  Sinonimo Waiwai
                                </Label>
                                <Field
                                  name="synonymWaiwai"
                                  type="text"
                                  className={`form-control ${
                                    errors.synonymWaiwai &&
                                    touched.synonymWaiwai
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="synonymWaiwai"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Row>
                            <Row>
                              <FormGroup className="w-100 pr-3">
                                <Label htmlFor="category">
                                  Categoria da palavra
                                </Label>
                                <Field
                                  name="category"
                                  type="text"
                                  className={`form-control ${
                                    errors.category && touched.category
                                      ? " is-invalid"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="category"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Row>
                            <Row>
                              <FormGroup className="w-50 pr-3">
                                <Label htmlFor="img_logo">
                                  Insira uma image
                                </Label>
                                <div style={{ border: "3px #00806b dashed" }}>
                                  {image ? (
                                    <>
                                      <div className="d-flex justify-content-end">
                                        <Button
                                          onClick={removeImage}
                                          type="button"
                                          color="none"
                                          className="px-1 py-0 my-0 mx-0 border border-white"
                                        >
                                          <span className="badge bg-secondary ">
                                            x
                                          </span>
                                        </Button>
                                      </div>
                                      <Image image={image} />
                                    </>
                                  ) : (
                                    <>
                                      <Dropzone
                                        onDrop={onDrop}
                                        accept={"image/*"}
                                      />
                                    </>
                                  )}
                                </div>
                              </FormGroup>
                              <FormGroup className="w-50">
                                <Label htmlFor="audio">Gravar audio</Label>
                                <AudioRecorder
                                  onRecordingComplete={(blob) =>
                                    addAudioElement(blob)
                                  }
                                  recorderControls={recorderControls}
                                />
                                <div className="my-2">
                                  {record ? (
                                    <>
                                      <div className="d-flex justify-content-start">
                                        <ReactAudioPlayer
                                          src={URL.createObjectURL(record)}
                                          controls
                                        />
                                        <Button
                                          onClick={removeAudio}
                                          type="button"
                                          color="none"
                                          className="px-1 py-0 my-0 mx-0 border border-white"
                                        >
                                          <span className="badge bg-secondary">
                                            x
                                          </span>
                                        </Button>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </FormGroup>
                            </Row>
                            <Row className="mt-3">
                              <FormGroup>
                                <Button
                                  type="submit"
                                  color="success"
                                  className="me-2"
                                  disabled={isLoading}
                                >
                                  Salvar
                                </Button>
                                <Button
                                  type="reset"
                                  color="danger"
                                  className="mx-3"
                                  disabled={isLoading}
                                >
                                  Cancelar
                                </Button>
                              </FormGroup>
                            </Row>
                          </Form>
                        )}
                      />
                      <ToastContainer />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Card>
        </Layout>
      </>
    );
  }
  return (
    <>
      <Layout>
        <Banner />
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  /**
   * Necessário signin para coletar o token válido, contrário retorna null
   */
  const accessToken = req.cookies.accessToken ? req.cookies.accessToken : null;
  return {
    props: { token: accessToken }, // will be passed to the page component as props
  };
}
