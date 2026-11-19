# Imported baseline inventory

| Workspace path | Imported source | Build root | Current stack |
| --- | --- | --- | --- |
| `apps/frontend` | `../sowler-blogs-front` | `apps/frontend/package.json` | UmiJS 2, React 16, DVA, Ant Design 3 |
| `apps/backend` | `../spring-cloud-base` | `apps/backend/pom.xml` | Java 8, Spring Boot 2.3.2, Spring Cloud Hoxton.SR9, Spring Cloud Alibaba 2.2.6 |

## Backend Maven modules

`common-module`, `framework-module`, `gateway-module`, `interface-module`, `order-module`, `picture-model`, `sms-model`, `user-module`, and `zipkin-module`.

## Import boundary

The originals are preserved as external sibling directories. Dependency directories and generated outputs (`node_modules`, `target`, `dist`, `build`, `.umi`) were deliberately not copied. Use the workspace copies as the only target for future approved feature work.
