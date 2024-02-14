import * as k8s from '@kubernetes/client-node';
import fs from 'fs';
import * as YAML from 'yaml';

export default class KubernetesService {
    private kc: k8s.KubeConfig;
    private podName: string;

    constructor() {
        this.kc = new k8s.KubeConfig();
        this.kc.loadFromDefault();
        this.podName = ''
    }

    triggerGitRepoBuilderPod = async (repoUrl: string, projectSlug: string, namespace: string = 'default') => {
        const podYaml = fs.readFileSync('repo-builder-pod.yaml', 'utf-8');
        const pod = YAML.parse(podYaml);

        this.podName = pod.metadata.name += projectSlug
        pod.spec.containers[0].name += projectSlug
        pod.spec.containers[0].env = this.getEnvironmentVariables(repoUrl, projectSlug);

        const k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
        const response = await k8sApi.createNamespacedPod(namespace, pod)
        console.log('Pod created:', response.body.metadata?.name);
    }

    cleanUpGitRepoBuilderPod = async (projectSlug: string, namespace: string = 'default') => {
        const k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
        const deletePodresponse = await k8sApi.deleteNamespacedPod(this.podName, namespace);
        console.log(`${this.podName} Pod deleted successfully.`);
    }

    private getEnvironmentVariables = (repoUrl: string, projectSlug: string) => {
        return [
            {
                name: 'GIT_REPOSITORY_URL',
                value: repoUrl
            },
            {
                name: 'BUILD_ID',
                value: projectSlug
            },
            {
                name: 'REGION',
                value: process.env.REGION
            },
            {
                name: 'ACCESS_KEY_ID',
                value: process.env.ACCESS_KEY_ID
            },
            {
                name: 'SECRET_ACCESS_KEY',
                value: process.env.SECRET_ACCESS_KEY
            },
            {
                name: 'SESSION_TOKEN',
                value: process.env.SESSION_TOKEN
            },
            {
                name: 'REDIS_URL',
                value: process.env.REDIS_URL
            },
        ];
    }
}